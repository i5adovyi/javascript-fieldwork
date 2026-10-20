import {executeSnippet} from './wiki-execution.js';
import {buildModules} from './wiki-code.js';

self.onmessage = async ({data}) => {
  let modules;
  const send = event => {
    self.postMessage(event);
    if (event.type === 'done') modules?.dispose();
  };
  try {
    if (data.files) modules = buildModules(data.files);
    await executeSnippet({...data,moduleURL:modules?.url},send);
  } catch(error) {
    send({type:'log',level:'error',text:`${error.name}: ${error.message}`});
    send({type:'done',error:true});
  }
};
