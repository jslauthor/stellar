var NwBuilder = require('node-webkit-builder');
var appdmg = require('appdmg');

var nw = new NwBuilder({
    files: ['./img/**/*', './js/bundle.js', './package.json', './index.html'], // use the glob format
    platforms: ['osx32', 'osx64', 'win32', 'win64'],
    macIcns: "./img/stellar.icns"
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {

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
        console.log("All done!")
    });

    ee.on('error', function (err) {
        console.log(err)
    });


}).catch(function (error) {
    console.error(error);
});