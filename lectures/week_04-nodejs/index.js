var fs = require('fs');

fs.writeFile('output.txt', 'The chicken crossed the road', function(err){
	if (err) {
		return console.error(err);
	}

	fs.readFile('output.txt', function(err, data){
		if (err) {
			return console.error(err);
		}
		console.log("1. Inside: " + data);
	})
})


fs.readFile('output.txt', function(err,data){
	if(err) {
		return console.error(err)
	}

	console.log("2. Outside: " + data)
})
/*
fs.readFile('input.txt', function(err, data){
	if (err) {
		return console.error(err);
	}
	console.log("1. Asynchronous read: " + data);
});

var data = fs.readFileSync('input.txt');
console.log("2. Sync read: " + data);

console.log("3. Program done");
*/

