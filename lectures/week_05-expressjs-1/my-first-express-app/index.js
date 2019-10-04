var express = require('express')
var app = express()
var bodyparser = require('body-parser');
var operations = require("./factorial")


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	console.log(operations);
	res.send("");
});

app.get('/factorial', function(req, res) {
	var num = req.query.number;
	if(!num) {return res.send("please send a number")}
	res.send(operations["factorial"](num) + "");
})

app.get('/square', function(req, res) {
	var num = req.query.number;
	if(!num) {return res.send("please send a number")}
	res.send(operations["square"](num) + "");	
})

app.get('/root', function(req, res) {
	var num = req.query.number;
	if(!num) {return res.send("please send a number")}
	res.send(operations["root"](num) + "");
})

app.get('/operation/:op', function(req,res) {
	var op = req.params.op;
	var num = req.query.number;
	if(!operations[op]) {
		return res.send("please send a correct operation")
	}
	if(!num){
		return res.send("please send a number");
	}
	res.send(operations[op](num) + "");
});

app.get('/hello', function(req, res) {
	res.send("hello endpoint reached");
})


var contacts = {}

app.get('/contacts', function(req, res) {
	res.json(contacts);
});

app.post('/contacts', function(req,res) {
	
	for(var contact in req.body) {
		contacts[contact] = req.body[contact];
	}
	res.send("success");
});


app.listen(3000, function() {
	console.log("connected on port 3000");
})