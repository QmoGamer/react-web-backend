"use strict";

module.exports = function(sequelize, DataTypes) {
  var Home_Ad = sequelize.define("Home_Ad", {
    img: DataTypes.STRING,
    url: DataTypes.STRING,
    order: DataTypes.INTEGER,
    text: DataTypes.STRING
  });

  return Home_Ad;
};