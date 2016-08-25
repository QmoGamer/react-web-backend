"use strict";

module.exports = function(sequelize, DataTypes) {
  var Footer_Second_Menu = sequelize.define("Footer_Second_Menu", {
  	name: DataTypes.STRING,
  	order: DataTypes.INTEGER,
  	is_url: DataTypes.INTEGER,
  	url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      	Footer_Second_Menu.belongsTo(models.Footer_Menu, { onDelete: "CASCADE"}) 
      	Footer_Second_Menu.belongsTo(models.Article)    	
      }
    }
  });

  return Footer_Second_Menu;
};