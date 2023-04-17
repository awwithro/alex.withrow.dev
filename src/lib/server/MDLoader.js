import { readFile } from "fs/promises"
import path from "path";

export async function loadMarkdown(pth){
    pth = path.join("./src/md/",pth)
    return await readFile(pth, {encoding: 'utf8' })
    
}