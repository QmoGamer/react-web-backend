"use strict";

module.exports = function(sequelize, DataTypes) {
  var Course_Detail = sequelize.define("Course_Detail", {
    name: DataTypes.STRING,
    area: DataTypes.STRING,
    course_date: DataTypes.STRING,
    course_time: DataTypes.STRING,
    google_url: DataTypes.STRING,
    number_of_people: DataTypes.INTEGER,
    start_time: DataTypes.DATEONLY,
    end_time: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        Course_Detail.belongsToMany(models.Member, {through: models.Course_Member})
        Course_Detail.belongsTo(models.Course)
      }
    }
  });

  return Course_Detail;
};