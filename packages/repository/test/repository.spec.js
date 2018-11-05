/* eslint-disable import/no-duplicates */
import Repository from '../lib'
import fs from 'fs-extra'
// import Index from '../lib'
import path from 'path'
import chai from 'chai'
import { promisify } from 'util'
import capture from 'collect-console'

const expect = chai.expect
const should = chai.should()


let cids = { origin: {}, modified: {}, deleted: {}}

cids.origin['test.md'] = 'QmShBmhvEZ1dDwPvLvpjimRW76AQrVz3fbpZYwsqNJN2Xh'
cids.origin[path.join('dir', 'test_1.md')] = 'Qmaij6pBZtRmVf6sUUaJ4rRkwkF78aqT38GP1YSZho7yLY'
cids.origin[path.join('dir', 'test_2.md')] = 'Qme4pabV5DApSeHsuWu6gXa3EyUj58N85hdMfdD7372rnV'
cids.origin[path.join('dir', 'sub', 'test.md')] = 'QmfHhdmitp8duYj8fsvDTkeRWd5szP7qnS4qEC8oCt37Hr'

cids.modified['test.md'] = 'QmUenaNZqJKZvz3qMaNaF4VBTpddpnr97wf6REKte7pJtw'
cids.modified[path.join('dir', 'test_1.md')] = 'QmXtt8JV8xAc4R8syRLvYeCkGCkaSd49kTGnZBpfyq2Srq'
cids.modified[path.join('dir', 'test_2.md')] = 'Qme4pabV5DApSeHsuWu6gXa3EyUj58N85hdMfdD7372rnV'
cids.modified[path.join('dir', 'sub', 'test.md')] = 'QmRS8LgmCc4SNbtwxnLmNRhNdFfP2dRDwYUeC8WNkQXuqm'

cids.deleted['test.md'] = 'null'
cids.deleted[path.join('dir', 'test_1.md')] = 'Qmaij6pBZtRmVf6sUUaJ4rRkwkF78aqT38GP1YSZho7yLY'
cids.deleted[path.join('dir', 'test_2.md')] = 'Qme4pabV5DApSeHsuWu6gXa3EyUj58N85hdMfdD7372rnV'
cids.deleted[path.join('dir', 'sub', 'test.md')] = 'null'

let paths = {}

paths['test.md']         = 'test.md'
paths['dir/test_1.md']   = path.join('dir', 'test_1.md')
paths['dir/test_2.md']   = path.join('dir', 'test_2.md')
paths['dir/sub']         = path.join('dir', 'sub')
paths['dir/sub/test.md'] = path.join('dir', 'sub', 'test.md')



const fixtures = {
    files: {
        modify: () => {
            fs.writeFileSync(path.join('test', 'fixtures', 'test.md'), 'modified test file\n', 'utf8')
            fs.writeFileSync(path.join('test', 'fixtures', 'dir', 'test_1.md'), 'modified dir test file 1\n', 'utf8')
            fs.writeFileSync(path.join('test', 'fixtures', 'dir', 'sub', 'test.md'), 'modified sub test file\n', 'utf8')
        },

        delete: () => {
            fs.removeSync(path.join('test', 'fixtures', 'test.md'))
            // fs.removeSync(path.join('test', 'fixtures', 'dir', 'sub', 'test.md'))
        }
    },

    directories: {
        delete: () => {
            fs.removeSync(path.join('test', 'fixtures', 'dir', 'sub'))
        }
    },

    restore: () => {
        fs.ensureDirSync(path.join('test', 'fixtures', 'dir'))
        fs.ensureDirSync(path.join('test', 'fixtures', 'dir', 'sub'))
        fs.writeFileSync(path.join('test', 'fixtures', 'test.md'), 'test file\n', 'utf8')
        fs.writeFileSync(path.join('test', 'fixtures', 'dir', 'test_1.md'), 'dir test file 1\n', 'utf8')
        fs.writeFileSync(path.join('test', 'fixtures', 'dir', 'test_2.md'), 'dir test file 2\n', 'utf8')
        fs.writeFileSync(path.join('test', 'fixtures', 'dir', 'sub', 'test.md'), 'sub test file\n', 'utf8')
    }
}

describe('@pando/repository', () => {
    let repository

    const clean = async () => {
        const reset = capture.log()

        await repository.node.start()
        await repository.node.stop()

        reset()

        await repository.remove()
        await fixtures.restore()
    }

    // describe('#create', () => {
    //     describe('no repository exists at given path', () => {
    //         after(async () => {
    //             await clean()
    //         })
    //
    //         it("it should initialize repository", async () => {
    //             repository = await Repository.create(path.join('test', 'fixtures'))
    //
    //             repository.paths['root'].should.equal(path.join('test', 'fixtures'))
    //             repository.paths['pando'].should.equal(path.join('test', 'fixtures', '.pando'))
    //             repository.paths['ipfs'].should.equal(path.join('test', 'fixtures', '.pando', 'ipfs'))
    //             repository.paths['fibers'].should.equal(path.join('test', 'fixtures', '.pando', 'fibers'))
    //             repository.node._repo.path.should.equal(path.join('test', 'fixtures', '.pando', 'ipfs'))
    //             repository.fibers.should.exist
    //         })
    //
    //         it("it should create .pando directory structure", async () => {
    //             fs.pathExistsSync(repository.paths['pando']).should.equal(true)
    //             fs.pathExistsSync(repository.paths['ipfs']).should.equal(true)
    //             fs.pathExistsSync(repository.paths['fibers']).should.equal(true)
    //         })
    //     })
    //
    //     describe('a repository exists at given path', () => {
    //         after(async () => {
    //             await clean()
    //         })
    //
    //         it("it should throw", async () => {
    //
    //         })
    //     })
    // })

    describe('#fibers', () => {
        let fiber


        // describe('#create', () => {
        //     describe('fiber does not already exist', () => {
        //         before(async () => {
        //             repository = await Repository.create(path.join('test', 'fixtures'))
        //         })
        //
        //         after(async () => {
        //             await clean()
        //         })
        //
        //         it('it should initialize fiber', async () => {
        //
        //             fiber = await repository.fibers.create('dev')
        //
        //             fiber.repository.should.deep.equal(repository)
        //
        //         })
        //
        //         it('it should initialize fiber', async () => {})
        //     })
        // })

        // describe('#load', () => {})
        //
        // describe('#switch', () => {})

        describe('#current', () => {
            describe('there is a current fiber', () => {
                let fiber_1, fiber_2, current

                before(async () => {
                    repository = await Repository.create(path.join('test', 'fixtures'))
                    fiber_1    = await repository.fibers.create('fiber_1')
                    fiber_2    = await repository.fibers.create('fiber_2')
                })

                after(async () => {
                    await clean()
                })

                it('it should return current fiber', async () => {
                    console.log('Switch one')
                    await repository.fibers.switch('fiber_1')
                    current = await repository.fibers.current({ uuid: true })
                    current.should.equal(fiber_1.uuid)
                    console.log('Switch two')

                    await repository.fibers.switch('fiber_2')
                    current = await repository.fibers.current({ uuid: true })
                    current.should.equal(fiber_2.uuid)

                    console.log('Switch three')

                    await repository.fibers.switch('master')
                })
            })
        })

        describe('#rename', () => {})
    })
})
