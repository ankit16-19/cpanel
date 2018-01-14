const Downloader = require('mt-files-downloader');
var downloader = new Downloader();
var url = require("url")
var path = require("path")

module.exports ={

    download: function (link, callback) {
        var target_url = link;
        var file_name;
        file_name = path.basename(url.parse(target_url).pathname);
        var file_path = path.join(__dirname, file_name)
        var dl = downloader.download(target_url, file_path);
        dl.start();

        dl.status === 1 ? callback(200): callback(500);
        
        require('./_handleEvent')(dl);
        require('./_printStats')(dl);
    },
    getStats: function (link, callback) {
        var dl = downloader.getDownloadByUrl(link);
        callback(dl.getStats())
    },
    getDownloads: function (callback) {
        callback(downloader.getDownloads())
    },
    do: function (command, link, callback) {
        var dl = downloader.getDownloadByUrl(link);
        switch (command){
            case 'stop':
                dl.stop();
                dl.status === -2 ? callback(true) : callback(false);
                break;
            case 'resume':
                dl.resume();
                dl.status === 1 ? callback(true) : callback(false);
                break;
            case 'destroy':
                downloader.removeDownloadByFilePath(path.join(__dirname, path.basename(url.parse(link).pathname)));
                dl.destroy();
                dl.status === -3 ? callback(true) : callback(false);
                break;
        }
    }



};