"use strict";

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define("Member", {
  	email: DataTypes.STRING,
  	phone: DataTypes.STRING,  	
    password_sha256: DataTypes.STRING,
    birthday: DataTypes.STRING,
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    company_name: DataTypes.STRING,
    company_id: DataTypes.STRING,
    company_city: DataTypes.INTEGER,
    company_area: DataTypes.INTEGER,
    company_address: DataTypes.STRING,
    company_phone: DataTypes.STRING,
    department: DataTypes.STRING,
    job_title: DataTypes.STRING,
    company_type1: DataTypes.INTEGER,
    company_type2: DataTypes.INTEGER,
    company_type3: DataTypes.INTEGER,
    source: DataTypes.INTEGER,
    is_enews: DataTypes.BOOLEAN,
    institution: DataTypes.INTEGER,
    reference: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      	Member.belongsToMany(models.Course_Detail, {through: models.Course_Member})
      	Member.belongsToMany(models.Activity_Detail, {through: models.Activity_Member})
      }
    }
  });

  return Member;
};