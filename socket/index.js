const utils = require('../utils');
const path = require('path');
module.exports =
    class Socket {
        objMap = {}
        constructor(server) {
            this.io = require('socket.io')(server)
            this.register()
            this.io.on('connection', (socket) => {
                socket.on('msg', res => {
                    try {
                        let action= res.action.split("_");
                        socket.emit('response', {
                            action:res.action,
                            data: this.objMap[action[0]][action[1]](res.data)
                        })
                    } catch (error) {
                        socket.emit('error', `${res.action} Not Found,${error}`)
                    }
                })
               
            })
        }
        socketEmit(data){
            this.io.emit('response', {
                action:'onMsg',
                data: data
            })
        }
        register() {
            try {
                let relativePath = '../server/socketFunction/'
                let dirPath = path.join(__dirname, relativePath)
                let modules = utils.fileDisplay(dirPath)
                let arr = modules.map(item => {
                    let postfixIndex = item.indexOf('.js')
                    if (postfixIndex != -1) {
                        return {
                            moduleName: item.slice(0, postfixIndex),
                            path: item,
                            relativePath: relativePath + item
                        }
                    }
                })
                arr.forEach(item => {
                    let moduleName = item.moduleName
                    let module = require(item.relativePath);
                    this.objMap[moduleName] = new module()
                })
            } catch (error) {
                console.log(error)
            }
        }
    }