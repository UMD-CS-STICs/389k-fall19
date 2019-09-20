var http = require("http")
const PORT = 8888;

function handleReq(req, res) {
	console.log("New request at " + req.url)
	if (req.url === '/robert') {
		var robert = {
			age: 21,
			gender: 'male',
			majors: ['Computer Science']
		};
		res.end(JSON.stringify(robert));
	} else {
		res.end("link hit: " + req.url);
	}
}



var server = http.createServer(handleReq)

server.listen(PORT, function() {
	console.log("Server is listening on: http://localhost:" + PORT);
})