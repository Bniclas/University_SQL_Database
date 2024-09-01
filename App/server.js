const http = require('http')
const https = require('http')
const app = require('./app')

const portHTTP = 3000
const portHTTPS = 3030

var options = {
    key: "",
    cert: "",
};


const httpserver = http.createServer(app)
const httpsserver = https.createServer( options, app )


if ( httpserver != null){
    console.log("[HTTP]> Server running")
}

if ( httpsserver != null){
    console.log("[HTTPS]> Server running")
}


httpserver.listen(portHTTP)
httpsserver.listen(portHTTPS)