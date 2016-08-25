"use strict";

module.exports = function(sequelize, DataTypes) {
  var Config = sequelize.define("Config", {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  });

  return Config;
};
