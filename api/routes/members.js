var models  = require('../models');
var express = require('express');
var router  = express.Router();

var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

router.get('/', function(req, res) {
	models.Member.findAll().then(function(members) {
		res.render('member_list', {			
			title: 'member_list',
			members: members
		})
	})
})

router.get('/:member_id', function(req, res){
	Promise.all([
		sequelize.query("SELECT Members.*, Cities.City, Areas.Area, Sources.option AS Source_option, Institutions.option AS Institution_option, Industries.option AS Industries_option, Industries2.option AS Industries2_option, Industries3.option AS Industries3_option FROM Members  LEFT JOIN Cities ON Members.company_city = Cities.id  LEFT JOIN Areas ON Members.company_area = Areas.id LEFT JOIN Sources ON Members.source = Sources.id LEFT JOIN Institutions ON Members.institution = Institutions.id LEFT JOIN Industries ON Members.company_type1 = Industries.id LEFT JOIN Industries AS Industries2 ON Members.company_type2 = Industries2.id LEFT JOIN Industries AS Industries3 ON Members.company_type3 = Industries3.id WHERE Members.id = "+req.params.member_id),
	  sequelize.query("SELECT Course_Details.* FROM Course_Members LEFT JOIN Course_Details ON Course_Members.CourseDetailId = Course_Details.id WHERE Course_Members.MemberId = "+req.params.member_id),
	  sequelize.query("SELECT Activity_Details.* FROM Activity_Members LEFT JOIN Activity_Details ON Activity_Members.ActivityDetailId = Activity_Details.id WHERE Activity_Members.MemberId = "+req.params.member_id)
	]).then(function(value) {
    res.render('member_detail', {			
			title: 'member_detail',
			member: value[0][0][0],
			courses: value[1][0],
			activitys: value[2][0]
		})
  })
})

router.get('/:member_id/destroy', function (req, res) {
  models.Member.destroy({
    where: { id: req.params.member_id }
  }).then(function() {
    res.redirect('/admin/members');
  });
});

module.exports = router;