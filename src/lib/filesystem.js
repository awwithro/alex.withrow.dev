import FFS from "fakefilesystem";

export var fs = new FFS();

fs.createDir("/", "/")
fs.createDir("/", "projects")
fs.createFile("/projects", "test.txt", "Hello World\n\rSecond Line")