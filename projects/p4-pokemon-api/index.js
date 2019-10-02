var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    // HINT: 
    var contents = "";
    _.each(_DATA, function(i, index) {
        contents += `<tr><td>${index+1}</td><td><a href="/pokemon/1">${i.name}</a></td></tr>\n`;
    })
    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    // HINT : 
    // <tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, {id: _id});
    if (!result) return res.json({});
    var contents = "";
    for (const key in result) {
        contents += `<tr><td>${key}</td><td>${JSON.stringify(result[key])}</td></tr>\n`;
    }
    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`
    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, {id: _id});
    if (!result) return res.send("Error: Pokemon not found")
    let imgUrl = result.img
    let html = `<html><body><img src=${imgUrl}></body></html>`;
    res.send(html);
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var pokeObject = _.findWhere(_DATA, {name: _name})

    if(!pokeObject) return res.send([]);

    var previous = _.map(pokeObject.prev_evolution, function(pokemon) {
        return pokemon.name
    });
    var next = _.map(pokeObject.next_evolution, function(pokemon) {
        return pokemon.name
    });
    var evoChain = previous.concat([_name]).concat(next);
    // Evolution Chain -> prev_evolutions + current + next_evolutions

    res.send(evoChain);

});

app.get("/api/type/:type", function(req, res) {
    var _type = req.params.type;
    var result = _.map(_.filter(_DATA, function(pokemon) {
        return pokemon.type.includes(_type)}), function(pokemon_of_type){
            return pokemon_of_type.name
    });

    if (!result) return res.send([]);
    res.send(result);
});

app.get("/api/type/:type/heaviest", function(req, res) {
    var _type = req.params.type;
    //first filter out on the pokemons of certain type,
    //then use _.max() function to get maximum weight of this filtered list
    var result = _.max(_.filter(_DATA, function(pokemon) {
        return pokemon.type.includes(_type)}), function(pokemon_of_type){
            return parseInt(pokemon_of_type.weight.split(" ")[0]);
    });

    if (result == -Infinity) return res.json({});
    
    //way to get subset of properties from an existing object
    var returnObj = (({name, weight}) => ({name, weight}))(result);
    
    if(Object.entries(returnObj).length == 0) {
        return res.json({});
    }
    returnObj.weight = returnObj.weight.split(" ")[0];
    res.json(returnObj);
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    var _name = req.params.pokemon_name;
    var _weakness_name = req.params.weakness_name;
    var result = _.findWhere(_DATA, {name: _name});
    if (!result) return res.json({});
    //add the weakness if its not there
    if(!result.weaknesses.includes(_weakness_name)) {
        result.weaknesses.push(_weakness_name);    
    }
    //replace instance
    let index = _.indexOf(_DATA, result);
    _DATA[index] = result;
    var returnObj = (({name, weaknesses}) => ({name, weaknesses}))(result);
    pokeDataUtil.saveData(_DATA);
    res.send(returnObj);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var _weakness_name = req.params.weakness_name;
    var result = _.findWhere(_DATA, {name: _name});

    if (!result) return res.json({});
    if(result.weaknesses.includes(_weakness_name)) {
        result.weaknesses.splice(result.weaknesses.indexOf(_weakness_name),1);
    }
    let index = _.indexOf(_DATA, result);
    _DATA[index] = result;
    var returnObj = (({name, weaknesses}) => ({name, weaknesses}))(result);
    pokeDataUtil.saveData(_DATA);
    res.send(returnObj); 
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
