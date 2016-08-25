"use strict";

module.exports = function(sequelize, DataTypes) {
  var Banner = sequelize.define("Banner", {
  	name: DataTypes.STRING,
    type: DataTypes.STRING,
    img: DataTypes.STRING,
    text: DataTypes.STRING,
    text_top: DataTypes.STRING,
    text_left: DataTypes.STRING,
    mobile_img: DataTypes.STRING,
    order: DataTypes.INTEGER,
    url: DataTypes.STRING,
    category: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Banner.belongsTo(models.Article)
        Banner.hasOne(models.Menu)
        Banner.hasOne(models.Activity)
      }
    }
  });

  return Banner;
};
