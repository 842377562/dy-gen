const fs = require('fs')
const os = require('os');
const path = require('path');


function findChildren(filePath) {
    let tree = []
    const blacklist = ['node_modules', '.git']
    if (!filePath) {
        throw new Error('filePath is Not Found,by findChildren')
    }
    const files = fs.readdirSync(filePath)
    files.forEach(filename => {
        let filedir = path.join(filePath, filename);
        if (blacklist.includes(filename)) return
        let stat = fs.lstatSync(filedir)
        let isFile = stat.isFile(); //是文件
        let isDir = stat.isDirectory(); //是文件夹
        let isApi = false
        let createDate = ""
        if (filename.endsWith('.js')) {
            let content = fs.readFileSync(filedir, "utf-8");
            isApi = content.indexOf('LOAD_API_URL') != -1
            try {
                if (isApi) {
                    let timeIndex = content.indexOf('@CreateDate') + 12
                    createDate = content.substring(timeIndex, timeIndex + 20)
                }
            } catch (error) {
                console.log(error)
            }

        }
        tree.push({
            path: filedir,
            name: filename,
            isFile,
            isApi,
            createDate,
            disabled: !isApi,
            children: isDir ? findChildren(filedir) : null
        })
        tree.sort()
    })
    return tree.sort((a, b) => {
        if (a.isFile != b.isFile) {
            return a.isFile - b.isFile
        }
        return a.name.localeCompare(b.name)
    })
}
module.exports = {

    /**
     * @desc读取目标文件夹下面的子目录
     * @param {String} filePath 读取的文件夹路径，默认用户根目录
     * @returns {Array} 子目录列表
     */
    nextFiles(filePath = os.homedir()) {
        const files = fs.readdirSync(filePath)
        let components = []
        let dir = filePath + '\\'
        files.forEach(function (item, index) {
            let stat = fs.lstatSync(dir + item)
            if (stat.isDirectory() === true) {
                components.push(item)
            }
        })
        return components
    },

    fileDisplay(filePath) {
        return fs.readdirSync(filePath)
    },

    /**
     * @desc 当前系统用户根目录
     * @returns 
     */
    homedir() {
        return os.homedir()
    },
    //获取目标文件夹的树结构
    findChildren: findChildren,

}