import { readFile, readdir } from "fs/promises"
import path from "path";

async function parseDir(dir, data, pth="/"){
    const files = await readdir(dir, {withFileTypes: true});
    for (const file of files)
        if (file.isDirectory()){
            data.dirs.push({path: pth, name: file.name})
            let newDir = path.join(dir, file.name)
            let newPath = path.join(pth, file.name)
            parseDir(newDir, data, newPath)
        } else{
            let fullName = path.join(dir,file.name)
            let content = await readFile(fullName, {encoding: "utf-8"})
            data.files.push({path: pth, name: file.name, content: content})
        }
}

export async function load(){

    let fileData = {
        dirs: [],
        files: []
    }
    await parseDir("./src/md", fileData);
    
    return{
        fileData: fileData
    }
}