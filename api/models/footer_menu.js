"use strict";

module.exports = function(sequelize, DataTypes) {
  var Footer_Menu = sequelize.define("Footer_Menu", {
  	name: DataTypes.STRING,
  	order: DataTypes.INTEGER,
  	is_url: DataTypes.INTEGER,
  	url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      	Footer_Menu.hasMany(models.Footer_Second_Menu,{ onDelete: "CASCADE" })
      	Footer_Menu.belongsTo(models.Article)
      }
    }
  });

  return Footer_Menu;
};