const http = require('http')
const https = require('http')
const app = require('./app')

const httpsOnly = (process.env.HTTPS_ONLY == "true") || false;
const portHTTP = process.env.PORT_HTTP || 3000;
const portHTTPS = process.env.PORT_HTTPS || 3030;

var options = {
    key: "",
    cert: "",
};

if ( httpsOnly ){
    const httpsserver = https.createServer( options, app );

    httpsserver.listen( portHTTPS );

    console.log( "[HTTPS]> Server running on " + portHTTPS );
}
else {
    const httpserver = http.createServer(app);
    const httpsserver = https.createServer( options, app );

    httpserver.listen( portHTTP );
    httpsserver.listen( portHTTPS );

    console.log( "[HTTP]> Server running on " + portHTTP );
    console.log( "[HTTPS]> Server running on " + portHTTPS );
}