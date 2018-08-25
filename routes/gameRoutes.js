var db = require("../models");
var giantbomb = require("giantbomb");
var gb = giantbomb(process.env.GB);

module.exports = function (app) {
  // Get all examples
  app.get("/api/games", function (req, res) {
    db.Game.findAll({
      include: [db.User]}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  app.get("/api/games/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Game.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // Create a new example
  app.post("/api/games", function (req, res) {
    db.Game.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/games/:id", function (req, res) {
    db.Game.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbExample) {
      res.json(dbExample);
    });
  });


  app.put("/api/games", function (req, res) {
    db.Game.update(req.body, {
      where: {
        id: req.body.id
      }
    })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });


  app.get("/api/gb/:game", function (req, res) {
    var response = [];
    gb.games.search(req.params.game, (err, rez, json) => {
      if (err) {
        throw err;
      }
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
        response.push(newGame);

      });
      res.json(response);
    });

  });
};