# ea-csv

### GLOBAL INSTALL:

`npm i -g ea-csv`

### OPTIONS:

`-1 --first-line-headers = use dataset in first line to label properties`

### EXAMPLE USAGE: 

`curl http://jslave2.herokuapp.com/gist/6c29309ec427900e99ce5d9d5178499c/sample.csv | csv -1`

### OR

`cat sample.csv | csv --firt-line-headers`

*(sample.csv in main repo folder ..  here an excerpt)*
```csv
street,city,zip,state,beds,baths,sq__ft,type,sale_date,price,latitude,longitude
3526 HIGH ST,SACRAMENTO,95838,CA,2,1,836,Residential,Wed May 21 00:00:00 EDT 2008,59222,38.631913,-121.434879
51 OMAHA CT,SACRAMENTO,95823,CA,3,1,1167,Residential,Wed May 21 00:00:00 EDT 2008,68212,38.478902,-121.431028
2796 BRANCH ST,SACRAMENTO,95815,CA,2,1,796,Residential,Wed May 21 00:00:00 EDT 2008,68880,38.618305,-121.443839
2805 JANETTE WAY,SACRAMENTO,95815,CA,2,1,852,Residential,Wed May 21 00:00:00 EDT 2008,69307,38.616835,-121.439146
6001 MCMAHON DR,SACRAMENTO,95824,CA,2,1,797,Residential,Wed May 21 00:00:00 EDT 2008,81900,38.51947,-121.435768
5828 PEPPERMILL CT,SACRAMENTO,95841,CA,3,1,1122,Condo,Wed May 21 00:00:00 EDT 2008,89921,38.662595,-121.327813
6048 OGDEN NASH WAY,SACRAMENTO,95842,CA,3,2,1104,Residential,Wed May 21 00:00:00 EDT 2008,90895,38.681659,-121.351705
2561 19TH AVE,SACRAMENTO,95820,CA,3,1,1177,Residential,Wed May 21 00:00:00 EDT 2008,91002,38.535092,-121.481367
11150 TRINITY RIVER DR Unit 114,RANCHO CORDOVA,95670,CA,2,2,941,Condo,Wed May 21 00:00:00 EDT 2008,94905,38.621188,-121.270555
```

## USAGE AS MODULE 

`npm i --save ea-csv

```js

var csv=require('es-csv');
var es=require('event-stream');
var fs=require('fs');

var stream=()=>fs.createReadStream('./sample.csv',{encoding:'utf-8'});

var useFirstLineHeaders=true;

//example: parse stream
stream()
    .pipe(csv.parse(useFirstLineHeaders))
    .pipe(es.writeArray((err,data)=>{
        if(err)
            throw(err);
        
        //print result 
        console.log([
            "DATA",
            "------", 
            util.inspect(data,{depth:null})
        ].join("\r\n"));

        //and reverse
        csv.write(data) 
            .pipe(process.stdout);
        
    });
```