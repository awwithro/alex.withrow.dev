import { readFile } from "fs/promises"

export async function load(){
    return{
        markdown: await readFile("./src/md/projects/makemea.md", {encoding: 'utf8' })
    }
}