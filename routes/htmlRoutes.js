var db = require("../models");
var path = require("path");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Game.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  app.get("/users", function(req, res){
    db.User.findAll({}).then(function(dbUsers){
      res.render("manage-user", {
        
      });
    });

  });
  

  // Load example page and pass in an example by id
  app.get("/user/:id", function(req, res) {
    db.Game.findAll({ where: { UserId: req.params.id }, include: [db.User] }).then(function(dbExample) {
      console.log();
      res.render("index", {
        examples: dbExample,
        msg: dbExample[0].User.name + "'s Games!"
      });
    });
  });

  app.get("/add", function(req,res){
    res.render("search-add");
  });


  app.get("/js", function(req,res){
    console.log("js called");
    res.sendFile(path.join(__dirname, "../public/js/index.js"));
  });
  app.get("/styles", function (req, res) {
    console.log("styles called");
    res.sendFile(path.join(__dirname, "../public/styles/styles.css"));
  });


  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
