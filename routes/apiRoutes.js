var db = require("../models");
var giantbomb = require("giantbomb");
var gb = giantbomb(process.env.GB);

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
  app.get("/api/gb/:game", function (req, res) {
    var response = [];
    console.log(req.params.game);
    gb.games.search(req.params.game, (err, rez, json) => {
      if (err) throw err;
      let games = json.results;
        games.forEach(game => {
          let newGame = {
            gameName: game.name,
            gameBio: game.deck,
            gamePicture: game.image.original_url,
            giantbombID: game.guid,
            gbURL: game.site_detail_url,
            gameConsole: game.platforms[0].abbreviation,
          };
          console.log(typeof game.original_game_rating);
          response.push(newGame);

        });
        res.json(response);
    });

  });
};
