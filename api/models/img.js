"use strict";

module.exports = function(sequelize, DataTypes) {
  var Img = sequelize.define("Img", {
  	name: DataTypes.STRING,
    path: DataTypes.STRING        
  }, {
    classMethods: {
      associate: function(models) {
        Img.belongsTo(models.Article, { onDelete: "CASCADE"})   
      }
    }
  });

  return Img;
};