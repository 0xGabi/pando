import Pando        from '@pando'
import Node         from '@components/node'
import Index        from '@components/index'
import Fibre        from '@components/fibre'
import Snapshot     from '@objects/snapshot'
import Tree         from '@objects/tree'
import File         from '@objects/file'
import FibreFactory from '@factories/fibre-factory.ts'
import * as utils   from '@locals/utils'
import path         from 'path'

export default class Loom {

  public static paths = {
    root:     '.',
    pando:    '.pando',
    ipfs:     '.pando/ipfs',
    index:    '.pando/index',
    current:  '.pando/current',
    fibres:   '.pando/fibres'
  }
  public pando:         Pando
  public node?:         Node
  public index?:        Index
  public workingFibre?: Fibre
  public fibre =        new FibreFactory(this)
  public paths =        { ...Loom.paths }

  public get head () {
  console.log(utils.yaml.read(path.join(this.paths.fibres, utils.yaml.read(this.paths.current))));
  return utils.yaml.read(path.join(this.paths.fibres, utils.yaml.read(this.paths.current)))
  }

  public constructor (_pando: Pando, _path: string = '.', opts?: any) {
    for (let p in this.paths) { this.paths[p] = path.join(_path, this.paths[p]) }
    this.pando = _pando
  }

  public static async new (_pando: Pando, _path: string = '.', opts?: any) : Promise < Loom > {
    let loom = new Loom(_pando, _path)

    await utils.fs.mkdir(loom.paths.pando)
    await utils.fs.mkdir(loom.paths.ipfs)
    await utils.fs.mkdir(loom.paths.fibres)
    await utils.yaml.write(loom.paths.index, {})
    await utils.yaml.write(loom.paths.current, 'undefined')

    loom.node  = await Node.new(loom)
    loom.index = await Index.new(loom)

    return loom
  }

  public static async load (_pando: Pando, _path: string = '.', opts?: any) : Promise < Loom > {
    if (!Loom.exists(_path)) { throw new Error('No pando loom found at ' + _path) }

    let loom = new Loom(_pando, _path)
    loom.node  = await Node.load(loom)
    loom.index = await Index.load(loom)

    return loom
  }

  public static exists (_path: string = '.'): boolean {
    for (let p in Loom.paths) {
      let expected = path.join(_path, Loom.paths[p])
      if(!utils.fs.exists(expected)) { return false }
    }
    return true
  }

  public async stage (_paths: string[]): Promise < void > {
    return this.index!.stage(_paths)
  }

  public async snapshot (_message: string): Promise < Snapshot > {
    let tree     = await this.tree()
    let treeCID  = await tree.put(this.node!)
    // Aller chercher le parent dans loom.head
    let snapshot = new Snapshot({ author: this.pando.configuration.user, tree: tree, parents: undefined, message: _message }) // à terme il faut mettre à jour le parent
    let cid      = await this.node!.put(await snapshot.toIPLD())

    //modify head of the current fibre in fibres
    if(utils.fs.exists(path.join(this.paths.fibres,this.workingFibre!.name))){
    utils.yaml.write(path.join(this.paths.fibres,this.workingFibre!.name),cid)
  }

    return snapshot
  }


  public async fromIPLD (object) {
    let attributes = {}, data = {}, node

    switch(object['@type']) {
      case 'snapshot':
        attributes = Reflect.getMetadata('ipld', Snapshot.prototype.constructor);
        break
      case 'tree':
        attributes = Reflect.getMetadata('ipld', Tree.prototype.constructor);
        break
      case 'file':
        attributes = Reflect.getMetadata('ipld', File.prototype.constructor);
        break
      default:
        throw new TypeError('Unrecognized IPLD node.')
    }

    for (let attribute in attributes) {
      if (attributes[attribute].link) {
        let type = attributes[attribute].type

        switch (type) {
          case 'map':
            data['children'] = {}
            for (let child in object) {
              if(child !== '@type' && child !== 'path') {
                data['children'][child] = await this.fromIPLD(await this.node!.get(object[child]['/']))
              }
            }
            break
          case 'array':
            data[attribute] = []
            for (let child of object[attribute]) {
              data[attribute].push(await this.fromIPLD(await this.node!.get(object[attribute][child]['/'])))
            }
            break
          case 'direct':
            data[attribute] = object[attribute]['/']
            break
          default:
            data[attribute] = await this.fromIPLD(await this.node!.get(object[attribute]['/']))
        }
      } else {
        data[attribute] = object[attribute]
      }
    }

    switch(object['@type']) {
      case 'snapshot':
        node = new Snapshot(data)
        break
      case 'tree':
        node = new Tree(data)
        break
      case 'file':
        node = new File(data)
        break
      default:
        throw new TypeError('Unrecognized IPLD node.')
    }

   return node
  }

  // Build tree from index and update the repo tree

  public tree () {
    let index  = this.index!.current
    let staged = this.index!.staged
    let tree   = new Tree({ path: '.' })

    for (let file of staged) {
      file.split(path.sep).reduce((parent, name): any => {
        let currentPath = path.join(parent.path!, name)
        if(!parent.children[name]) {
          if(index[currentPath]) {
            parent.children[name] = new File({ path: currentPath, link: index[currentPath].stage })
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


  public async checkout (_fibreName: string) {
    //We check if the fibre exists
    if(!utils.fs.exists(path.join(this.paths.fibres, _fibreName))){
    throw new Error('Fibre doesn\'t exists')
  }

    //Check if there are staged files uncommitted
    if(this.index!.staged !== null){
      throw new Error('Files must be comitted before checking out')
    }

    //Check if there are unstaged files in conflict with the files of the new branch.
    await this.compareNewFiberTreeAndLocal(_fibreName)

    let oldFibre = utils.yaml.read(this.paths.current)
    // Change the current working Fibre
    this.workingFibre = await Fibre.update(this,_fibreName)

    // Compare the two branch heads trees. Delete the wrong files, add the new ones.
    this.downloadFibreContent(utils.yaml.read(path.join(this.paths.fibres, oldFibre)),utils.yaml.read(path.join(this.paths.fibres, _fibreName)))
  }

  public async compareNewFiberTreeAndLocal (_fibreName : string){

    //We check if the fibre exists
    if(!utils.fs.exists(path.join(this.paths.fibres, _fibreName))){
    throw new Error('Fibre doesn\'t exists')
  }

  let newFibreCID = utils.yaml.read(path.join(this.paths.fibres, _fibreName))

  let newFibreTree = await this.fromIPLD(await Tree.get(this.node!,newFibreCID))

  //We go through the tree and compare the files.
  await this.compareTreeAndLocal(newFibreTree)
}

public async compareTreeAndLocal (_tree : any){
  //if(this.index!.current[_tree.path] !== _tree[]
  if(_tree instanceof Tree){
  if(_tree.children instanceof Array){
    await Promise.all(_tree.children.map(async (child) => {
      this.compareTreeAndLocal(child)
    }));
  }

}
else if(_tree instanceof File) {
  if(_tree.link !== this.index!.current[_tree.path!].wdir)
  throw new Error('A local file (unstaged) conflicts with this fibre files. File path :' + _tree.path)
}
else {
  throw new Error('Unknown exception : You\'re not inpecting a tree or a file')
}
}

public async downloadFibreContent (_oldFibreCID : string, _newFibreCID : string)
{

  // Get the new branch tree
  let newFibreTree = await this.fromIPLD(await Tree.get(this.node!,_newFibreCID))

  // Get the old branch tree
  let oldFibreTree = await this.fromIPLD(await Tree.get(this.node!,_oldFibreCID))

  this.compareTrees(oldFibreTree,newFibreTree)
}

public async compareTrees (_oldTree : any, _newTree : any)
{
  if(_oldTree instanceof Tree && _newTree instanceof Tree){
    if(_oldTree.children instanceof Array && _newTree.children instanceof Array ){
      // Each file or directory existing only in the new tree must be downloaded
      let missingFilesOrTrees = _newTree.children.filter(item => (_oldTree.children as Array<any>).indexOf(item) < 0)
      this.downloadFiles(missingFilesOrTrees)

      //Each file or directory existing only in the old tree must be deleted
      let unwantedFilesOrTrees = _oldTree.children.filter(item => (_newTree.children as Array<any>).indexOf(item) < 0)
      this.deleteFilesOrTrees(unwantedFilesOrTrees)

      //Every file with the same name but a different hash must be merged

      //Iteration inside all the trees
      let commonFilesOrTrees_newTree = _newTree.children.filter(item => missingFilesOrTrees.indexOf(item) < 0)
      let commonFilesOrTrees_oldTree = _oldTree.children.filter(item => unwantedFilesOrTrees.indexOf(item) < 0)

      for (var _i = 0; _i < commonFilesOrTrees_newTree.length; _i++){
        if(commonFilesOrTrees_newTree[_i] instanceof File && commonFilesOrTrees_oldTree[_i] instanceof File){
          if(commonFilesOrTrees_newTree[_i].link !== commonFilesOrTrees_oldTree[_i].link){
            this.deleteFilesOrTrees(commonFilesOrTrees_newTree[i])
            this.downloadFiles(commonFilesOrTrees_newTree[_i])
          }
        }
        else{
          await this.compareTrees(commonFilesOrTrees_newTree[_i],commonFilesOrTrees_oldTree[_i])
        }
      }
    }
  }
}

public async downloadFiles(_files : Array<any>)
{
  //TODO fill this function : Download a file. Creates the directory it lies in if it doesn't exist.
}

public async deleteFilesOrTrees (_filesOrTrees : Array<any>)
{
  //TODO delete local files
}
  // public async weave (_originFibreName: string, _destinationFibreName: string) {
  //
  // }
  //
  // public async revert (_snapshotCID: string) {
  //
  // }
}
