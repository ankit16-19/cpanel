var express = require('express');
var router = express.Router();
var si = require('systeminformation');
const dash = require('./downloader')

/* GET home page. */
router.get('/static', function(req, res, next) {

    getStaticData();

    function getStaticData() {
        si.getStaticData(function (data) {

            res.json(data)
        })
    }
});
router.get('/dynamic', function(req, res, next) {

    getDynamicData();

    function getDynamicData() {
        si.getDynamicData(function (data) {
            res.json(data)
        })


    }
});

router.get('/files', function(req, res, next) {
    var obj = [];
    getdirData(req.query.dir);
    function getdirData(dir) {
        shell.cd();
        shell.cd(dir)
        var filesDetails = shell.exec('ls -l').split('\n').filter(function (value) {
            return value != '';
        });
        var fileName = shell.exec('ls').split('\n').filter(function (value) {
            return value != '';
        });
        obj.push({
            fileName,filesDetails
        });
        res.json(obj)
    }
});

router.get('/downloadFile', function(req, res, next) {
    downloadFile(req.query.dir, req.query.file);
    function downloadFile (dir, file) {
        shell.cd();
        shell.cd(dir);
        var dir = shell.exec('pwd');
        res.sendFile(dir.trim() +"/"+ file.replace(" /g","\\"));
    }
});

router.get('/downloader', function (req, res, next) {
    dash.download(req.query.link, function (data) {
        res.status(data).send('Done; Response status: ' + data);
    });

})
router.get('/getStats', function (req, res, next) {
    dash.getStats(req.query.link, function (data) {
        res.json(data);
    })
})
router.get('/getDownloads', function (req, res, next) {
    dash.getDownloads(function (data) {
        res.json(data);
    })
})
router.get('/dl', function (req, res, next) {
    dash.do(req.query.command,req.query.link, function (data) {
        res.send(data);
    })
})

module.exports = router;

