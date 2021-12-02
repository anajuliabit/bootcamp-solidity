import { ipfsNotInitializedError } from '@shared/constants';
import { create, IPFS } from 'ipfs-core';
import all from 'it-all';

export class StorageService {
  public ipfs: IPFS | null = null;

  async init() {
    this.ipfs = await create();
  }

  async addText(text: string): Promise<string> {
    if(!this.ipfs) {
      throw new Error(ipfsNotInitializedError);
    }
    
    const result = await this.ipfs.add(text);
    return result.cid.toString();   
  }

  async addImage(image: Buffer): Promise<string> {
    if(!this.ipfs) {
      throw new Error(ipfsNotInitializedError);
    }
    const buff = Buffer.from(image)
    const result = await this.ipfs.add(buff);
    return result.cid.toString();
  }

  async get(cid: string): Promise<string> {
    if(!this.ipfs) {
      throw new Error(ipfsNotInitializedError);
    }
    
    const result = await all(this.ipfs.cat(cid));
    return Buffer.concat(result).toString('base64');
  }

  async getImage(cid: string): Promise<string> {
    if(!this.ipfs) {
      throw new Error(ipfsNotInitializedError);
    }
    
    const result = await all(this.ipfs.cat(cid));
    return Buffer.concat(result).toString('base64');
  }
 
}