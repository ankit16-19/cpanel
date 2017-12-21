var express = require('express');
var router = express.Router();
var si = require('systeminformation');
var shell = require('shelljs');

/* GET home page. */
router.get('/static', function(req, res, next) {
    var obj = [];

    getStaticData();

    function getStaticData() {
        si.getStaticData(function (data) {
            obj.push({
                Host: data.os.hostname,
                operatingSystem:data.os.distro + " " + data.os.platform + " " + data.os.release,
                kernalCpu: os.platform + " " + os.kernal + " on " + os.arch,
                processorInformation: cpu.manufacturer + " " + cpu.brand + " @ " + cpu.speed + " , " + cpu.cores,

            })
            res.json(data)
        })
    }
});
router.get('/dynamic', function(req, res, next) {
    var obj = {
        cpu: {},
        memory: {},
        storage: {},
        diskSpeed:{},
        networks:{},
        networkSpeed:[]
    };

    getDynamicData();

    function getDynamicData() {
        si.currentLoad(function (data) {
            obj['cpu'] = {
                systemTime: shell.exec('date').replace('\n', ""),
                systemUptime: shell.exec('uptime -p').replace('\n', "").replace("up", "").trim(),
                cpuPercent: data.currentload
            };
            getMemoryData();
        })
    }
    function getMemoryData () {
        si.mem(function (data) {
            obj['memory'] = {
                totalMemory: data.total/(1024*1024*1024),
                usedMemory: data.active/(1024*1024*1024),
                percetageUsed: (data.active / data.total) * 100
            }
           getStorageData()
        })
    }
    function getStorageData() {
        si.fsSize(function (data) {
            data.forEach(function (value) {
                value.size = value.size/(1024*1024*1024);
                value.used = value.used/(1024*1024*1024);
            });
            obj['storage'] = (data);
            getFileTransferSpeed()
        })
    }
    function getFileTransferSpeed () {
        si.disksIO(function (data) {
            obj['diskSpeed'] = {
                readPerSec : data.rIO_sec,
                writePerSec :data.wIO_sec
            };
            getNetworkData()
        })
    }
    function getNetworkData () {
        si.networkInterfaces(function (data) {
            obj['networks'] = data;
            getNetworkSpeedData(data);
            });
    }
    function getNetworkSpeedData(data) {
        var i = 0;
        data.forEach(function (value) {
            si.networkStats(value.iface, function (data2) {
                data2.rx = data2.rx / (1024 * 1024 * 1024);
                data2.tx = data2.tx / (1024 * 1024 * 1024);
                data2.rx_sec = data2.rx_sec / 1024;
                data2.tx_sec = data2.tx_sec / 1024;
                obj.networkSpeed.push(data2);
                i++;
                if(i >= data.length){
                    res.json(obj);
                }
            });
        });

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


module.exports = router;

