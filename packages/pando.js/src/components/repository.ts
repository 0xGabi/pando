import register from 'module-alias/register'

import Branch from '@components/branch'
import Index from '@components/index'
import Node from '@components/node'
import BranchFactory from '@factories/branch-factory'
import RemoteFactory from '@factories/remote-factory'
import File from '@objects/file'
import Snapshot from '@objects/snapshot'
import Tree from '@objects/tree'
import Pando from '@root'
import * as utils from '@utils'
import CID from 'cids'
import npath from 'path'

export default class Repository {
  /* tslint:disable:object-literal-sort-keys */
  public static paths = {
    root: '.',
    pando: '.pando',
    ipfs: '.pando/ipfs',
    index: '.pando/index',
    current: '.pando/current',
    config: '.pando/config',
    branches: '.pando/branches',
    remotes: '.pando/remotes'
  }
  /* tslint:enable:object-literal-sort-keys */

  public static async remove(path: string = '.') {
    utils.fs.rm(npath.join(path, Repository.paths.pando))
  }

  public static exists(path: string = '.'): boolean {
    for (const p in Repository.paths) {
      if (Repository.paths.hasOwnProperty(p)) {
        const expected = npath.join(path, Repository.paths[p])
        if (!utils.fs.exists(expected)) {
          return false
        }
      }
    }
    return true
  }

  public pando: Pando
  public node?: Node
  public index?: Index
  public branches = new BranchFactory(this)
  public remotes = new RemoteFactory(this)
  public paths = { ...Repository.paths }

  public get currentBranchName(): string {
    return utils.yaml.read(this.paths.current)
  }

  public set currentBranchName(name: string) {
    utils.yaml.write(this.paths.current, name)
  }

  public get currentBranch(): Branch {
    return this.branches.load(this.currentBranchName)
  }

  public get head() {
    return this.currentBranch.head
  }

  public get config(): any {
    return utils.yaml.read(this.paths.config)
  }

  public set config(config: any) {
    utils.yaml.write(this.paths.config, config)
  }

  public constructor(pando: Pando, path: string = '.', opts?: any) {
    for (const p in this.paths) {
      if (this.paths.hasOwnProperty(p)) {
        this.paths[p] = npath.join(path, this.paths[p])
      }
    }
    this.pando = pando
  }

  public async stage(paths: string[]): Promise<any> {
    const index = await this.index!.stage(paths)
    return index
  }

  public async snapshot(message: string): Promise<Snapshot> {
    const index = await this.index!.update()

    if (!this.index!.unsnapshot.length) {
      throw new Error('Nothing to snapshot')
    }

    const tree = await this.tree()
    await tree.put(this.node!)

    const parents =
      this.head !== 'undefined' ? [await this.fromCID(this.head)] : []

    const snapshot = new Snapshot({
      author: this.pando.config.author,
      message,
      parents,
      tree
    })

    // const cid = await this.node!.put(await snapshot.toIPLD())
    const cid = await snapshot.put(this.node!)
    this.currentBranch.head = cid

    return snapshot
  }

  public async push(remoteName: string, branch: string): Promise<any> {
    const head = this.head
    const remote = await this.remotes.load(remoteName)
    const remoteBranch = await this.branches.load(branch, {
      remote: remoteName
    })
    const remoteHead = await remoteBranch.head

    if (head === 'undefined') {
      throw new Error('Nothing to push')
    }
    if (remoteHead === head) {
      throw new Error(
        "Branch '" +
          branch +
          "' of remote '" +
          remoteName +
          "' is already up to date"
      )
    }

    const snapshot = await this.fromCID(head)
    await snapshot.put(this.node!)
    const tx = await remote.push(branch, head)
    remoteBranch.head = head
    return tx
  }

  public async fetch(remotes: string[]): Promise<any> {
    const heads = {}

    for (const remoteName of remotes) {
      const remote = await this.remotes.load(remoteName)
      heads[remoteName] = await remote.fetch()
    }

    return heads
  }

  public async pull(remote: string, branch: string): Promise<any> {
    await this.index!.update()

    if (!this.remotes.exists(remote)) {
      throw new Error("Remote '" + remote + "' does not exist")
    }
    if (!this.branches.exists(branch, { remote })) {
      throw new Error("Branch '" + remote + ':' + branch + "' does not exist")
    }
    if (this.index!.unsnapshot.length) {
      throw new Error(
        'You have unsnapshot modifications: ' + this.index!.unsnapshot
      )
    }
    if (this.index!.modified.length) {
      throw new Error(
        'You have unstaged and unsnaphot modifications: ' + this.index!.modified
      )
    }

    await this.fetch([remote])

    const newHead = this.branches.head(branch, { remote })
    const baseHead = this.head

    if (newHead === 'undefined') {
      throw new Error(
        "Branch '" + branch + ':' + remote + "' has no snapshot yet"
      )
    }

    let newTree
    let baseTree

    newTree = await this.node!.get(newHead, 'tree')

    if (baseHead !== 'undefined') {
      baseTree = await this.node!.get(baseHead, 'tree')
    } else {
      baseTree = await new Tree({ path: '.', children: [] }).toIPLD()
    }

    await this.updateWorkingDirectory(baseTree, newTree)
    await this.index!.reinitialize(newTree)

    this.currentBranch.head = newHead
  }

  public async status(): Promise<any> {
    await this.index!.update()

    const unsnapshot = this.index!.unsnapshot
    const modified = this.index!.modified
    const untracked = this.index!.untracked

    return { unsnapshot, modified, untracked }
  }

  public async log(branchName: string, opts?: any): Promise<any[]> {
    const branch = await this.branches.load(branchName, opts)
    const log = await branch.log()

    return log
  }

  public async fromCID(cid: string, path?: string) {
    path = path || ''
    let data: any
    let index = 0

    const object = await this.node!.get(cid, path || '')

    switch (object['@type']) {
      case 'snapshot':
        data = {
          author: object.author,
          message: object.message,
          parents: [],
          timestamp: object.timestamp,
          tree: undefined
        }

        data.tree = await this.fromCID(cid, path + 'tree/')

        for (const parent of object.parents) {
          const parentSnapshot = await this.fromCID(
            cid,
            path + 'parents/' + index + '/'
          )
          data.parents.push(parentSnapshot)
          index++
        }

        return new Snapshot(data)
      case 'tree':
        data = { path: object.path, children: {} }
        delete object['@type']
        delete object.path

        for (const child in object) {
          if (object.hasOwnProperty(child)) {
            data.children[child] = await this.fromCID(cid, path + child + '/')
          }
        }
        return new Tree(data)
      case 'file':
        const link = new CID(object.link['/'])
        return new File({
          link: link.toBaseEncodedString(),
          path: object.path
        })
      default:
        throw new TypeError('Unrecognized IPLD node')
    }
  }

  public async updateWorkingDirectory(baseTree: any, newTree: any) {
    const baseCID = await this.node!.cid(baseTree)
    const newCID = await this.node!.cid(newTree)

    // Delete meta properties to loop over tree's entries only
    delete baseTree['@type']
    delete baseTree.path
    // Delete meta properties to loop over tree's entries only
    delete newTree['@type']
    delete newTree.path

    for (const entry in newTree) {
      if (!baseTree[entry]) {
        // entry existing in newTree but not in baseTree
        // await this.node!.download(newTree[entry]['/'])
        await this.node!.download(newCID, entry)
        delete baseTree[entry]
      } else {
        // entry existing both in newTree and in baseTree
        if (baseTree[entry]['/'] !== newTree[entry]['/']) {
          const baseEntryType = await this.node!.get(baseCID, entry + '/@type/')
          const newEntryType = await this.node!.get(newCID, entry + '/@type/')

          if (baseEntryType !== newEntryType) {
            // entry type differs in baseTree and newTree
            await this.node!.download(newCID, entry)
          } else if (baseEntryType === 'file') {
            // entry type is the same in baseTree and newTree
            // entry is a file
            await this.node!.download(newCID, entry)
          } else if (baseEntryType === 'tree') {
            // entry type is the same in baseTree and newTree
            // entry is a tree
            const baseEntry = await await this.node!.get(baseCID, entry + '/')
            const newEntry = await this.node!.get(newCID, entry + '/')
            await this.updateWorkingDirectory(baseEntry, newEntry)
          }
        }
        delete baseTree[entry]
      }
    }

    for (const entry in baseTree) {
      if (baseTree.hasOwnProperty(entry)) {
        const path = await this.node!.get(baseCID, entry + '/path/')
        utils.fs.rm(npath.join(this.paths.root, path))
      }
    }
  }

  private tree() {
    const index = this.index!.current
    const tree = new Tree({ path: '.' })
    const staged = this.index!.staged

    staged.forEach((file, i) => {
      if (index[file].stage === 'todelete') {
        delete index[file]
        staged.splice(i, 1)
      }
    })

    for (const file of staged) {
      file.split(npath.sep).reduce((parent, name): any => {
        const currentPath = npath.join(parent.path!, name)
        if (!parent.children[name]) {
          if (index[currentPath]) {
            parent.children[name] = new File({
              link: index[currentPath].stage,
              path: currentPath
            })
            index[currentPath].repo = index[currentPath].stage
          } else {
            parent.children[name] = new Tree({ path: currentPath })
          }
        }
        return parent.children[name]
      }, tree)
    }

    this.index!.current = index
    return tree
  }
}
