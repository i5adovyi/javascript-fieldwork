// A single, opt-in PDF copy in this browser's IndexedDB. No network or exports.
export const BOOK_FILE_DATABASE='fieldwork-private-pdf-v1';
export const MAX_BOOK_FILE_BYTES=200*1024*1024;
const TABLE='files',KEY='remembered';

function validate(value){
  if(!value||value.version!==1||!/^[a-f0-9]{64}$/.test(value.bookId)||
     typeof value.name!=='string'||!value.name||value.name.length>1024||
     !(value.blob instanceof Blob)||!value.blob.size||value.blob.size>MAX_BOOK_FILE_BYTES){
    throw new Error('The remembered PDF could not be read safely. Forget it and choose your original file again.');
  }
  return {version:1,bookId:value.bookId,name:value.name,blob:value.blob};
}

export function createBookFileStore(factory=globalThis.indexedDB){
  if(!factory?.open)throw new Error('This browser does not allow local PDF storage.');
  function transact(mode,operation){
    return new Promise((resolve,reject)=>{
      let database,transaction,settled=false,result;
      const finish=(error)=>{
        if(settled)return;
        settled=true;clearTimeout(timeout);database?.close();
        if(error)reject(error);else resolve(result);
      };
      const timeout=setTimeout(()=>{
        try{transaction?.abort();}catch{}
        finish(new Error('Local PDF storage did not respond. Close other studio tabs and try again.'));
      },10000);
      let opening;
      try{opening=factory.open(BOOK_FILE_DATABASE,1);}catch(error){finish(error);return;}
      opening.onupgradeneeded=()=>{
        if(settled){opening.transaction.abort();return;}
        if(!opening.result.objectStoreNames.contains(TABLE))opening.result.createObjectStore(TABLE);
      };
      opening.onerror=()=>finish(opening.error||new Error('Local PDF storage could not open.'));
      opening.onblocked=()=>finish(new Error('Local PDF storage is busy in another tab. Close that tab and try again.'));
      opening.onsuccess=()=>{
        database=opening.result;
        if(settled){database.close();return;}
        database.onversionchange=()=>database.close();
        try{
          transaction=database.transaction(TABLE,mode);
          transaction.oncomplete=()=>finish();
          transaction.onabort=()=>finish(transaction.error||new Error('The local PDF storage change was cancelled.'));
          transaction.onerror=()=>{}; // Abort reports the final result; request success is not a commit.
          const request=operation(transaction.objectStore(TABLE));
          request.onsuccess=()=>{result=request.result;};
        }catch(error){
          try{transaction?.abort();}catch{}
          finish(error);
        }
      };
    });
  }
  return Object.freeze({
    async read(){
      const result=await transact('readonly',store=>store.get(KEY));
      return result===undefined?null:validate(result);
    },
    async remember(value){
      const entry=validate({...value,version:1});
      await transact('readwrite',store=>store.put(entry,KEY));
      return entry;
    },
    async forget(){
      await transact('readwrite',store=>store.delete(KEY));
    }
  });
}
