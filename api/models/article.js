"use strict";

module.exports = function(sequelize, DataTypes) {
  var Article = sequelize.define("Article", {
  	name: DataTypes.STRING,
    content: DataTypes.TEXT,
    category: DataTypes.INTEGER 
  }, {
    classMethods: {
      associate: function(models) {
      	Article.hasMany(models.Article_Anchor,{ onDelete: "CASCADE" })
      	Article.hasMany(models.Img,{ onDelete: "CASCADE" })
      	Article.hasMany(models.Banner)
      	Article.hasMany(models.Menu)
      	Article.hasMany(models.Footer_Menu)
      	Article.hasMany(models.Footer_Second_Menu)
      	Article.hasOne(models.Course)
      	Article.hasOne(models.Activity)
      }
    }
  });

  return Article;
};