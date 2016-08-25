"use strict";

module.exports = function(sequelize, DataTypes) {
  var Institution = sequelize.define("Institution", {
    option: DataTypes.STRING  
  });

  return Institution;
};