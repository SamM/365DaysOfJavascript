// I based this file off the simple static file server script found at:
// https://gist.github.com/jonlabelle/9689998

var path = require('path');
var fs = require('fs');


// 
// Configuration 
// 

var config = {
    
    // www root
    root: '.',

    // default file to serve
    index: 'index.html',

    // http listen port
    port: process.env.PORT || 3000,

    exclude: ['static-server.js', /^base_day(.*)$/]

};


// 
// HTTP Server
// 

require('http').createServer(function (request, response) {
    var url = require('url').parse(request.url);
    var fileName = path.normalize(config.root + url.pathname);
    var file = (fileName == config.root + '/') ? fileName + config.index : fileName;
    var query = url.search;
    
    console.log('Trying to serve: ', file);

    var exclude = false;

    if(Array.isArray(config.exclude)){
        config.exclude.forEach(function(search){
            if(fileName.search(search)!=-1){
                exclude = true;
            }
        });
    }
    if(exclude){
        response.writeHead(404);
        response.end('Not found');
        return;
    }

    function showError(error) {
        console.log(error);

        response.writeHead(500);
        response.end('Internal Server Error');
    }

    fs.exists(file, function (exists) {
        if (exists) {
            fs.stat(file, function (error, stat) {
                var readStream;

                if (error) {
                    return showError(error);
                }

                if (stat.isDirectory()) {
                    response.writeHead(403);
                    response.end('Forbidden');
                }
                else {
                    readStream = fs.createReadStream(file);

                    readStream.on('error', showError);

                    response.writeHead(200);
                    readStream.pipe(response);
                }
            });
        }
        else {
            response.writeHead(404);
            response.end('Not found');
        }
    });

}).listen(config.port, function() {
    console.log('Server running at http://localhost:%d', config.port);
});