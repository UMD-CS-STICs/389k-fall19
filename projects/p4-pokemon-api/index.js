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
   var contents = "";
   _.each(_DATA, function(i) {
       contents += `<tr><td>1</td><td><a href="/pokemon/1">Nelson</a></td></tr>\n`;
   })
   var html = `<html>\n<body>\n<table>CONTENTS</table>\n</body>\n</html>`;
   res.send(html);
    //res.send("UNIMPLEMENTED ENDPOINT");
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    // HINT : 
    // <tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
    //res.send("UNIMPLEMENTED ENDPOINT");
    var _id = req.params.pokemon_id;

    var result = _.find(_DATA, function(i){
      return i.id == _id;
    });
    res.render("info", {pokemonInfo: result});
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    res.send("UNIMPLEMENTED ENDPOINT");
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    //res.send("UNIMPLEMENTED ENDPOINT");
    var curr_pokemon = req.params.pokemon_name;
    var result = [];
    _.each(_DATA, function(i) {
      if(curr_pokemon == i.name){
				console.log(i) 
      }
    });
   res.send(result);

});

app.get("/api/type/:type", function(req, res) {
    //res.send("UNIMPLEMENTED ENDPOINT");
    var _type = req.params.type;
    var results = [];
    _.each(_DATA, function(i){
      if(i.type[0] == _type){
        results.push(i.name);
      };
    });
    if (!result) {
      return res.json({});
    }
    res.json(results);
});

app.get("/api/type/:type/heaviest", function(req, res) {
    //res.send("UNIMPLEMENTED ENDPOINT");
    var _type = req.params.type;
    if(_type == null){
      return res.json({});
    }
    var result = [];
    var y =[];
  
  
    var x = _.filter(_DATA, function(i){
      return i.type == _type;
    });
  
    _.each(x, function(j){
      j.weight = parseInt(j.weight.replace(/\D/g,''));
      y.push(_.pick(j,'name','weight'));
    });

    // result = _.max(y, function(k){
    //     return k.weight;
    //   });
    
  
    if (!result) {
      return res.json({});
    }
  
    res.json(result);
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    //res.send("UNIMPLEMENTED ENDPOINT");
    var name = req.params.pokemon_name;
    var weakness = req.params.weakness_name;
    var result = [];
    var bool = true;
    if(!name){
        return res.json({});
    }
    var nameValue = _.find(_DATA, function(x){
        return name == x.name;
     });

    for(var i = 0; i < nameValue.weaknesses.length; i++){
        if(weakness == nameValue.weaknesses[i]){
            bool = false;
        }
    }

  if(bool == true){
     nameValue.weaknesses.push(weakness);
     pokeDataUtil.saveData(_DATA);
   }

  _.each(_DATA, function(i){
    result.push(_.pick(i,'name','weaknesses'));
  });

  res.json(result);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    //res.send("UNIMPLEMENTED ENDPOINT");
  var name = req.params.pokemon_name;
  var weakness = req.params.weakness_name;
  var result = [];
  
  if(!name){
    return res.json({});
  }
  var nameValue = _.find(_DATA, function(x){
    return name == x.name;
  });

  for(var i = 0; i < nameValue.weaknesses.length; i++){
    if(weakness == nameValue.weaknesses[i]){
      nameValue.weaknesses.pop(weakness);
      pokeDataUtil.saveData(_DATA);
    }
  }

  _.each(_DATA, function(i){
    result.push(_.pick(i,'name','weaknesses'));
  });
 
  res.json(result);

  
});



// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
