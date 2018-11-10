var csvWriter = require('csv-write-stream');
var csvParser = require('csv-parser');
var es = require('event-stream');
var util = require('util');
var fs = require('fs');

var parseArgs = (args) => { var argv = require("minimist")(args); return argv; };
var argv = parseArgs(process.argv);




var csv = {
    parser(headers) {
        var opts={};
        if(!headers) {
            opts = {headers:false};    
        }
        return csvParser(opts);
    },
    writer(headers) {
        var opts={};
        if(!headers) {
            opts = {sendHeaders:false};    
        }
        return csvWriter(opts);
    },
    parse(s,headers) {
        var stream; 

        if(typeof(s)=='string') {
            stream=es.readArray(s.split(/\r?\n/));
        } else if (Array.isArray(s)) {
            stream=es.readArray(s);
        } else if (s && s.pipe) {
            stream=s;
        } else {
            throw new TypeError('parse() Argument must be a string, an array or a readable stream');
        }

        return stream
            .pipe(es.split(/(\r?\n)/))
            .pipe(this.parser(headers))
            .pipe(es.map(function(dataset,callback){
                var values=Object.values(dataset);
                if(headers) {
                  if(Array.isArray(headers)) {
                        var parsed = headers
                            .map((property,index)=>[property, values[index]])
                            .reduce((object, [property,value])=>(object[property]=value,object),{});
                  } else {
                      var parsed=dataset;
                  }
                } else {
                    var parsed = values;
                } 
                /*
                console.log(
                    "\n",
                    `---dataset---`, "\n",
                    `${util.inspect(parsed)}`, "\n\n",
                    `---values---`, "\n",
                    `${util.inspect(values)}`, 
                    "\n\n"
                );
                */
                callback(null, parsed);
        }));

    },
    write(iterable,headers) {
        var opts={sendHeaders:false};
        var data = [...iterable];
        
        if(headers) {
            data=data.map(dataset=>{
                if(!Array.isArray(dataset)) {
                    if(Array.isArray(headers)) {
                        var keys=Object.keys(dataset);
                        var values=headers.map(property=>dataset[property])
                    } else {
                        var keys=Object.keys(dataset);
                        var values=Object.values(dataset)
                    }    
                } else {
                    var values=dataset;
                }
            });
        };
        return es.readArray(data)
            .pipe(csv.writer(opts));
    },
    toArray(s,headers) {
        return new Promise((resolve, reject)=>{
            csv.parse(s,headers)
                .pipe(es.writeArray((err,docs)=>{ 
                    if(err) { 
                        reject(err); 
                    };
                    resolve(docs);
                }));
        });
    }
}

module.exports = csv;
//process.exit()

/*
var csvWithHeaders=csvParser({headers:'street,city,zip,state,beds,baths,sq__ft,type,sale_date,price,latitude,longitude'.split(',')});
var csv=csvParser();
var stream = fs.createReadStream('./spreadsheet.csv',{encoding:'utf8'})
	.pipe(csvParser({headers:false}))
	.pipe(es.map(function(dataset,callback){
			var values=Object.values(dataset);
			console.log(
				"\n",
				`---dataset---`, "\n",
				`${util.inspect(dataset)}`, "\n\n",
				`---values---`, "\n",
				`${util.inspect(values)}`, 
				"\n\n"
			);
			callback(null, values);
	}));

stream
	.pipe(csvWriter({sendHeaders:false}))
	.pipe(es.wait(function(err,body){
		console.log(body)
	}))
*/
// // All of these arguments are optional. 
// var options = {
//     delimiter : '\t', // default is , 
//     endLine : '\n', // default is \n, 
//     //columns : ['columnName1', 'columnName2'], // by default read the first line and use values found as columns  
//     escapeChar: '"', // default is an empty string 
//     enclosedChar : '"' // default is an empty string 
// }

// var csvStream = csv.createStream(options);
// request('http://mycsv.com/file.csv').pipe(csvStream)
//     .on('error',function(err){
//         console.error(err);
//     })
//     .on('data',function(data){
//         // outputs an object containing a set of key/value pair representing a line found in the csv file. 
//         console.log(data);
//     })
//     .on('column',function(key,value){
//         // outputs the column name associated with the value found 
//         console.log('#' + key + ' = ' + value);
//     })