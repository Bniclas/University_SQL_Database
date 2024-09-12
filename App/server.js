const http = require('http')
const https = require('http')
const app = require('./app')

var options = {
    key: "",
    cert: "",
};

if ( process.env.HTTPS_ONLY == "true" ){
    const httpsserver = https.createServer( options, app );

    httpsserver.listen(process.env.PORT_HTTPS);

    console.log( "[HTTPS]> Server running on " + process.env.PORT_HTTPS );
}
else {
    const httpserver = http.createServer(app);
    const httpsserver = https.createServer( options, app );

    httpserver.listen(process.env.PORT_HTTP);
    httpsserver.listen(process.env.PORT_HTTPS);

    console.log( "[HTTP]> Server running on " + process.env.PORT_HTTP );
    console.log( "[HTTPS]> Server running on " + process.env.PORT_HTTPS );
}