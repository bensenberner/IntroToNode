 var fs = require('fs');
// console.log(fs);
 console.log(fs.readFileSync('./file1.txt').toString());
 //fs.readFile('./file1.txt', function(err, data) {
   //console.log(data);
   //console.log(data.toString());
 //});
