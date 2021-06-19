#!/usr/bin/env node

/**
 * Module dependencies.
 */

 var app = require('./app');
 var debug = require('debug')('npm:server');
 var http = require('http');
 var Socket =require('./socket')
 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || 8000);
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 
 var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 global.io= new Socket(server)
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   var bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       // port is already in use,port+1 again listen
       port+=1
       server.close();
       server.listen(port);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 const opn = require('opn');
 
 function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 
   const projectUrl=`http://localhost:${addr.port}/`
   console.log(`服务启动成功: ${projectUrl}`);
 
   // Opens the url in the default browser
   opn(projectUrl);
 }
 