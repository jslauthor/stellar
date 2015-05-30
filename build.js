var dotenv = require('dotenv').load();
var NwBuilder = require('node-webkit-builder');
var appdmg = require('appdmg');
var spawn = require('child_process').spawn;

var nw = new NwBuilder({
    version: "0.12.0",
    files: ['./img/**/*', './js/bundle.js', './package.json', './*.html'], // use the glob format
    platforms: ['osx64', 'win32'],
    macIcns: "./img/stellar.icns",
    winIco: "./img/stellar.ico"
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {

    var appSign = spawn('sh', ['app_sign.sh', './build/stellar/osx64/stellar.app', process.env.APPLE_DEV_ID ]);

    appSign.stdout.on('data', function (data) {
        process.stdout.write('[APP SIGN] ' + data.toString());
    });

    appSign.stderr.on('data', function (data) {
        process.stdout.write('[APP SIGN ERROR] ' + data.toString());
    });

    appSign.on('close', function (code) {
        process.stdout.write('App signing complete! ' + code);

        var ee = appdmg({ source: 'dmg.json', target: './build/stellar/osx64/stellar.dmg' });

        ee.on('progress', function (info) {

            if (typeof info.title != 'undefined')
                console.log("Running DMG step: " + info.title)

            // info.current is the current step
            // info.total is the total number of steps
            // info.type is on of 'step-begin', 'step-end'

            // 'step-begin'
            // info.title is the title of the current step

            // 'step-end'
            // info.status is one of 'ok', 'skip', 'fail'

        });

        ee.on('finish', function () {
            console.log("DMG done!");

            var dmgSign = spawn('sh', ['dmg_sign.sh', './build/stellar/osx64/stellar.dmg', process.env.APPLE_DEV_ID ]);

            dmgSign.stdout.on('data', function (data) {
                process.stdout.write('[DMG SIGN] ' + data.toString());
            });

            dmgSign.stderr.on('data', function (data) {
                process.stdout.write('[DMG SIGN ERROR] ' + data.toString());
            });

        });

        ee.on('error', function (err) {
            console.log(err)
        });

    });


}).catch(function (error) {
    console.log(error);
});