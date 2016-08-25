"use strict";

module.exports = function(sequelize, DataTypes) {
  var Menu = sequelize.define("Menu", {
  	name: DataTypes.STRING,
    component: DataTypes.STRING,
    customComponent: DataTypes.STRING,
    url: DataTypes.STRING,
    order: DataTypes.INTEGER 
  }, {
    classMethods: {
      associate: function(models) {
      	Menu.belongsTo(models.Article)
      	Menu.belongsTo(models.Banner)
      	Menu.belongsTo(models.Course)
      	Menu.hasMany(models.Activity)
        Menu.hasMany(models.Menu, { onDelete: "CASCADE" })
        Menu.belongsTo(models.Menu, { onDelete: "CASCADE" })
      }
    }
  });

  return Menu;
};
