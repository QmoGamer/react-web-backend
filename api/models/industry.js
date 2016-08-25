"use strict";

module.exports = function(sequelize, DataTypes) {
  var Industry = sequelize.define("Industry", {
  	option: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Industry.hasMany(models.Industry, { onDelete: "CASCADE" })
        Industry.belongsTo(models.Industry, { onDelete: "CASCADE" })
      }
    }
  });

  return Industry;
};