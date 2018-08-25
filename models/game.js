module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    gameName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    summary: DataTypes.TEXT,
    gamePicture: DataTypes.STRING,
    giantbombID: DataTypes.STRING,
    giantbombURL: DataTypes.TEXT,
    gameConsole: DataTypes.STRING,
    ownedStatus: DataTypes.TEXT,


  });
  Game.associate = function (models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Game.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Game;
};




