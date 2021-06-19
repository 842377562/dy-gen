const utils = require('../../utils');
const axios = require('axios');
const fs = require('fs')

function http(url) {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                reject(res.status)
            }
        }).catch(err => {
            reject(error);
        })
    })
}

module.exports = class {
    #currentDir = {
        currentDirPath: utils.homedir(), //当前文件路径
        currentChildDirs: utils.nextFiles()
    }
    currentDir() {
        return this.#currentDir
    }
    changeCurrentDirPath(res) {
        this.#currentDir = {
            currentDirPath: res,
            currentChildDirs: utils.nextFiles(res)
        }
        return this.currentDir()
    }
    setProjectPath(res) {
        this.#currentDir.projectPath = res
        return this.currentDir()
    }
    getDirTree() {
        return utils.findChildren(this.#currentDir.projectPath)
    }
    onMsg(data) {
        global.io.socketEmit(data)
    }
    async upDateApiFile({
        fileList,
        baseUrl
    }) {
        for (const item of fileList) {
            let content = fs.readFileSync(item.path, "utf-8");
            let startIndex = content.indexOf('LOAD_API_URL') //读取文件夹，是否有下载url关键字
            if (startIndex == -1) { //没有关键字
                continue
            }
            let endIndex = content.indexOf('**/', startIndex)
            let loadApiUrl = content.substring(startIndex, endIndex).replace(new RegExp(/( )/g), "") //截取关键字
            loadApiUrl = baseUrl + loadApiUrl.substring(loadApiUrl.indexOf('=') + 1)
            try {
                let res = await http(loadApiUrl)
                fs.writeFileSync(item.path, res)
                this.onMsg({
                    status: 200,
                    msg: `${item.name}更新完成`,
                    data: item
                })
            } catch (error) {
                this.onMsg({
                    status: 500,
                    msg: `${item.name}发生了错误!`,
                    data: error
                })
            }
        }
        this.onMsg({
            status: 200,
            msg: '更新完成!',
            list: fileList
        })

        // fileList.forEach(async item => {
        //     let content = fs.readFileSync(item.path, "utf-8");

        //     let startIndex = content.indexOf('LOAD_API_URL') //读取文件夹，是否有下载url关键字
        //     if (startIndex == -1) { //没有关键字
        //         return
        //     }
        //     let endIndex = content.indexOf('**/', startIndex)
        //     let loadApiUrl = content.substring(startIndex, endIndex).replace(new RegExp(/( )/g), "") //截取关键字
        //     loadApiUrl = baseUrl + loadApiUrl.substring(loadApiUrl.indexOf('=') + 1)
        //     let res=await http(loadApiUrl)
        //     fs.writeFileSync(item.path, res)
        //     return item.name
        //     // http(loadApiUrl).then(res => {
        //     //     fs.writeFileSync(item.path, res)
        //     // })
        // });

    }
}