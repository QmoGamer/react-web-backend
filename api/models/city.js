"use strict";

module.exports = function(sequelize, DataTypes) {
  var City = sequelize.define("City", {
    City: DataTypes.STRING  
  }, {
    classMethods: {
      associate: function(models) {
      	City.hasMany(models.Area)
      }
    }
  });

  return City;
};