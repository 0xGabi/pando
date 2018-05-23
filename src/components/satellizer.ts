import IPLD from 'ipld'
import Pando from '@pando'
import CID from 'cids'


export default class Satellizer {
    
  public ipfs: any
  public ipld: any
  
  public constructor (_ipfs: any) {
    this.ipfs = _ipfs
    this.ipld = new IPLD(this.ipfs.block)
  }
  
  public async put (object: any): Promise < any > {
    return new Promise < any > (async (resolve, reject) => {
      await this.ipfs.start()
      let opts = { format: 'dag-cbor', hashAlg: 'keccak-256' }
      this.ipld.put(object, opts, async (err, cid) => {
        await this.ipfs.stop()
        if(err) {
          reject(err)
        } else {
          resolve(cid.toBaseEncodedString())
        }
      })
    })
  }
  
  public async get (cid: string): Promise < any > {
    console.log(cid)
    return new Promise < any > (async (resolve, reject) => {
      await this.ipfs.start()
      this.ipld.get(new CID(cid), '', async (err, result) => {
        await this.ipfs.stop()
        if (err) {
          reject(err)
        } else {
          resolve(result.value)
        }
      })
    })
  }
  

}
  