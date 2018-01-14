var url = require("url")
var path = require("path")
var mtd = require('zeltice-mt-downloader')


module.exports =  {
    download: function(link) {
        var target_url = link;
        var file_name = path.basename(url.parse(target_url).pathname)
        var file_path = path.join(__dirname, file_name)

        var options = {
            //To set the total number of download threads
            count: 8, //(Default: 2)
            //To set custom headers, such as cookies etc.
            headers: {cookies: 'abc=pqr;'},
            //HTTP method
            method: 'GET', //(Default: GET)
            //HTTP port
            port: 80, //(Default: 80)
            //If no data is received the download times out. It is measured in seconds.
            timeout: 5, //(Default: 5 seconds)
            //Control the part of file that needs to be downloaded.
            range: '0-100', //(Default: '0-100')
            //Triggered when the download is started
            onStart: function(meta) {
                console.log('Download Started', meta);
            },
            //Triggered when the download is completed
            onEnd: function(err, result) {
                if (err) console.error(err);
                else console.log('Download Complete', result);
                clearInterval(timer);
            }
        };

        var downloader = new mtd(file_path, target_url, options)
        downloader.start()
        var timer = setInterval(console.log(downloader),1000);

    },
    restartDownload: function (path) {
        var downloader = new mtd(file_path)
        downloader.start()
    }
}
