import {readFile,writeFile} from 'node:fs/promises';

export const STUDY_FILES=['field-guide.html','handbook.md','CURRICULUM-MAP.md','wiki-reference.md'];

function crc32(bytes){
  let crc=0xffffffff;
  for(const byte of bytes){
    crc^=byte;
    for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}

// ZIP32, stored entries: no dependencies, timestamps, host paths, or variable metadata.
// A fixed entry order and DOS date (1980-01-01) make unchanged inputs byte-reproducible.
export async function buildStudyPack(root){
  const local=[],directory=[];
  let offset=0;
  for(const name of STUDY_FILES){
    const filename=Buffer.from(name);
    const bytes=await readFile(new URL(name,root));
    const checksum=crc32(bytes);
    const header=Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50,0);
    header.writeUInt16LE(20,4);
    header.writeUInt16LE(0x0800,6);
    header.writeUInt16LE(0x0021,12);
    header.writeUInt32LE(checksum,14);
    header.writeUInt32LE(bytes.length,18);
    header.writeUInt32LE(bytes.length,22);
    header.writeUInt16LE(filename.length,26);
    const central=Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50,0);
    central.writeUInt16LE(0x0314,4);
    central.writeUInt16LE(20,6);
    central.writeUInt16LE(0x0800,8);
    central.writeUInt16LE(0x0021,14);
    central.writeUInt32LE(checksum,16);
    central.writeUInt32LE(bytes.length,20);
    central.writeUInt32LE(bytes.length,24);
    central.writeUInt16LE(filename.length,28);
    central.writeUInt32LE((0o100644*0x10000)>>>0,38);
    central.writeUInt32LE(offset,42);
    local.push(header,filename,bytes);
    directory.push(central,filename);
    offset+=header.length+filename.length+bytes.length;
  }
  const central=Buffer.concat(directory),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);
  end.writeUInt16LE(STUDY_FILES.length,8);
  end.writeUInt16LE(STUDY_FILES.length,10);
  end.writeUInt32LE(central.length,12);
  end.writeUInt32LE(offset,16);
  await writeFile(new URL('study-pack.zip',root),Buffer.concat([...local,central,end]));
}
