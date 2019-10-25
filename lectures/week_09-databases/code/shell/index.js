var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var dotenv = require('dotenv');
var Movie = require('./models/Movie');

// Load envirorment variables
dotenv.load();


// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// Setup Express App
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/movie', function(req, res) {
    // Create new movie
    var movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        year: parseInt(req.body.year),
        reviews: []
    });

    // Save movie to database
    movie.save(function(err) {
        if (err) throw err;
        return res.send('Succesfully inserted movie.');
    });  

});

app.delete('/movie/:id', function(req, res) {
    // Find movie by id
    Movie.findByIdAndRemove(req.params.id, function(err, movie) {
        if (err) throw err;
        if (!movie) {
            return res.send('No movie found with given ID.');
        }
        res.send('Movie deleted!');
    });

});

app.get('/movie', function(req, res) {
    // Get all movies
    Movie.find({}, function(err, movies) {
        if (err) throw err;
        res.send(movies);
    });
});

app.post('/movie/:id/review', function(req, res) {
    // Add a review
    Movie.findOne({ _id: req.params.id }, function(err, movie) {
        if (err) throw err;
        if (!movie) return res.send('No movie found with that ID.');
        movie.reviews.push({
            rating: parseFloat(req.body.rating),
            comment: req.body.comment,
            author: req.body.author
        });
    });
});

app.delete('/movie/:id/review/last', function(req, res) {
    // Delete last review
    Movie.findByIdAndRemove(req.params.id, function(err, movie) {
        if (err) throw err;
        if (!movie) {
            return res.send('No movie found with given ID.');
        }
        res.send('Movie deleted!');
    });
});


app.listen(3000, function() {
    console.log('App listening on port 3000!');
})
