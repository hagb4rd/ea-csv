#!/usr/bin/env node
var util = require('util');
var fs = require('fs');
var csv = require('../index');
var es = require('event-stream');

var parseArgs = (args) => { var argv = require("minimist")(args); return argv; };
var argv = parseArgs(process.argv);

//console.log(argv);

var help = () => console.log(`

OPTIONS:

-1 --first-line-headers = use dataset in first line to label properties

EXAMPLE USAGE: 

curl http://jslave2.herokuapp.com/gist/6c29309ec427900e99ce5d9d5178499c/sample.csv | csv -1

OR

cat sample.csv | csv --firt-line-headers

`);


if(argv['?'] || argv['help'] || argv['h']) {
    help();
    process.exit(0);
}

try {

    var headers = !!(argv[1] || argv['first-line-headers']);

    //var input = process.openStdin();
    var input = process.stdin;
    csv.parse(input,headers)
        .pipe(es.stringify())
        .pipe(process.stdout);
} catch (err) {
    console.log(err);
    help();
    process.exit(1);

}

