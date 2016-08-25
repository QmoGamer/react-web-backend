"use strict";

module.exports = function(sequelize, DataTypes) {
  var Activity_Detail = sequelize.define("Activity_Detail", {
    name: DataTypes.STRING,
    area: DataTypes.STRING,
    activity_date: DataTypes.STRING,
    location: DataTypes.STRING,
    google_url: DataTypes.STRING,
    number_of_people: DataTypes.INTEGER,
    start_time: DataTypes.DATEONLY,
    end_time: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models) {
        Activity_Detail.belongsToMany(models.Member, {through: models.Activity_Member})
        Activity_Detail.belongsTo(models.Activity)
      }
    }
  });

  return Activity_Detail;
};