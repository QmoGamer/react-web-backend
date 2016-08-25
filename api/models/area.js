"use strict";

module.exports = function(sequelize, DataTypes) {
  var Area = sequelize.define("Area", {
    Area: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Area.belongsTo(models.City)        
      }
    }
  });

  return Area;
};