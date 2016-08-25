"use strict";

module.exports = function(sequelize, DataTypes) {
  var Article_Anchor = sequelize.define("Article_Anchor", {
    name: DataTypes.STRING,
    anchor: DataTypes.STRING 
  }, {
    classMethods: {
      associate: function(models) {
        Article_Anchor.belongsTo(models.Article, { onDelete: "CASCADE"})        
      }
    }
  });

  return Article_Anchor;
};