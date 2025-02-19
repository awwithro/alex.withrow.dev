import { readFile } from "fs/promises"
import { error } from '@sveltejs/kit';

export async function load({ params }){
    let md
    try{
       md = await readFile(`./src/md/projects/${params.project}.md`, {encoding: 'utf8' })
    } catch{
        error(404, 'Not Found');
    }
    return{
        markdown: md
    }
}