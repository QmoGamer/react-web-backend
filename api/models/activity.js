"use strict";

module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    name: DataTypes.STRING,
    is_show: DataTypes.BOOLEAN,
    start_time: DataTypes.DATEONLY,
    end_time: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
      	Activity.belongsTo(models.Banner)
  			Activity.belongsTo(models.Article)
  			Activity.belongsTo(models.Menu)     
        Activity.hasMany(models.Activity_Detail)
      }
    }
  });

  return Activity;
};