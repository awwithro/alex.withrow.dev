import { readFile, readdir } from "fs/promises"
import path from "path";
import child_process from 'child_process';

async function parseDir(dir, data, pth = "/") {
    const files = await readdir(dir, { withFileTypes: true });
    for (const file of files)
        if (file.isDirectory()) {
            data.dirs.push({ path: pth, name: file.name })
            let newDir = path.join(dir, file.name)
            let newPath = path.join(pth, file.name)
            await parseDir(newDir, data, newPath)
        } else {
            let fullName = path.join(dir, file.name)
            let content
            if (fullName.endsWith(".md")) {
                let out, err;
                const render = child_process.spawnSync('glow', ['--style=dark', fullName], {
                    stdio: ['ignore', out, err]
                });
                let output = render.output.toString()
                content = output.substring(1, output.length - 1) //trim ticks;
            } else {
                content = await readFile(fullName, { encoding: "utf-8" })
            }
            data.files.push({ path: pth, name: file.name, content: content })
        }
}

export async function load() {

    let fileData = {
        dirs: [],
        files: []
    }
    await parseDir("./src/md", fileData);
    return {
        fileData: fileData
    }
}