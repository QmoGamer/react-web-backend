"use strict";

module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define("Course", {
    name: DataTypes.STRING,
    is_show: DataTypes.BOOLEAN,
    start_time: DataTypes.DATEONLY,
    end_time: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        Course.belongsTo(models.Article)
        Course.hasMany(models.Course_Detail)
      }
    }
  });

  return Course;
};