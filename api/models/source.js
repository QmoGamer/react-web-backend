"use strict";

module.exports = function(sequelize, DataTypes) {
  var Source = sequelize.define("Source", {
    option: DataTypes.STRING  
  });

  return Source;
};