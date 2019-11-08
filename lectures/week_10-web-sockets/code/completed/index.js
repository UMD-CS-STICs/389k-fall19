var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
/*
Allow server to use Socket.io
1. Switch to http server, but pass in express app in the function handler (so we can still use app to route all our URLs)
2. Use socket io to connect to the web server
3. Change app.listen to http.listen
4. Use socket io to handle new connections to our server -> io.on('connection' ....){}
*/
//=====================================
var http = require('http').Server(app);
var io = require('socket.io')(http);
//=====================================

dotenv.load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

var Movie = require('./models/Movie');

app.get('/', function(req, res) {
    res.render('chat');
});

app.get('/movies', function(req, res) {
    Movie.find({}, function(err, movies) {
        return res.render('movies', { movies: movies });
    });
});
/*  ===================TASK 2====================
    Task 2 (SERVER SIDE): Handle a new movie post
    Steps to complete task 2:
        1. Handle POST request
        2. Create new movie
        3. Save new movie to database
        4. Emit new movie message to all clients currently connected
*/

//Task 2 - Step 1: Handle POST request
app.post('/movies', function(req, res) {
    var genre = req.body.genre;
    var title = req.body.title;
    //Task 2 - Step 2: Create new movie
    var movie = new Movie({
        title: title,
        genre: genre
    });
    //Task 2 - Step 3 & 4: Save new movie to database, emit new movie message to clients
    movie.save(function(err){
        if(err) throw err;
        io.emit('new movie', movie);
        return res.send('Done!');
    })
});

//An event listener to listen for client connecting to our server
io.on('connection', function(socket) {
    console.log('NEW connection');
    /*
        - Handle listening for "messages" 
            -> socket.on(message, function(msg)){...}
        - Sending out messages to ALL clients currently connected
            -> io.emit(message, contentOfMessage)
    */

    /*        ===================TASK 1====================
        TASK 1 (SERVER END): Handle a new chat message from a client 
        Steps to compelete task 1 on server end.
            1. Listen for a new chat message
            2. Emit new chat message to all clients currently connected
    */
   //Task 1 - Step 1: Listen for a new chat message
    socket.on('chat message', function(msg) {
        //Task 2 - Step 2: Emit new chat message to all clients currently connected
        io.emit('chat message', msg);
    })
    
        
    socket.on('disconnect', function() {
        console.log('User has disconnected');
    });
});

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
