const http = require('http')
const https = require('http')
const app = require('./app')

var options = {
    key: "",
    cert: "",
};


const httpserver = http.createServer(app)
const httpsserver = https.createServer( options, app )


if ( httpserver != null){
    console.log("[HTTP]> Server running" + process.env.PORT_HTTP)
}

if ( httpsserver != null){
    console.log("[HTTPS]> Server running")
}


httpserver.listen(process.env.PORT_HTTP)
httpsserver.listen(process.env.PORT_HTTPS)