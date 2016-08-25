var models  = require('../models');
var express = require('express');
var router  = express.Router();

var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

router.get('/', function(req, res) {
	Promise.all([
		models.Course.findAll({
			include: [ models.Course_Detail ]
		}),
		models.Article.findAll({ where: { category: 5 } })
	]).then(function(values){
		res.render('course_list', {
			title: 'course_list',
			courses: values[0],
			articles: values[1]
		})
	})
})

router.get('/course_details/:course_detail_id', function(req, res){
	Promise.all([
		models.Course_Detail.findOne({ where: { id: req.params.course_detail_id } }),
		sequelize.query("SELECT Members.* FROM Course_Members LEFT JOIN Members ON Course_Members.MemberId = Members.id WHERE Course_Members.CourseDetailId = "+req.params.course_detail_id)
	]).then(function(values){
		res.render('course_detail', {
			title: 'course_detail',
			course_detail: values[0],
			members: values[1][0]
		})
	})
})

router.post('/course_details/update', function(req, res) {
	models.Course_Detail.update(
		{
			name: req.body.name,
			area: req.body.area,
			course_date: req.body.course_date,
			course_time: req.body.course_time,
			google_url: req.body.google_url,
			number_of_people: req.body.number_of_people
		},
		{
			where: { id: req.body.course_detail_id }
		}
	).then(function() {
		res.redirect('/admin/courses/course_details/'+req.body.course_detail_id)
	})
})

router.post('/course_details/create', function(req, res) {
  models.Course_Detail.create({
  	name: req.body.name,
  	CourseId: req.body.course_id	
  }).then(function() {
    res.redirect('/admin/courses');
  });
});

router.get('/course_details/:course_detail_id/destroy', function(req, res) {
	models.Course_Detail.destroy({
    where: { id: req.params.course_detail_id }
  }).then(function() {
    res.redirect('/admin/courses');
  });
})

router.post('/create', function(req, res) {
  models.Course.create({
  	name: req.body.name,
  	ArticleId: req.body.article_id != 0 ? req.body.article_id : null
  }).then(function() {
    res.redirect('/admin/courses');
  });
});

router.post('/update', function(req, res) {
	models.Course.update(
		{
			name: req.body.name,
			ArticleId: req.body.article_id != 0 ? req.body.article_id : null
		},
		{
			where: { id: req.body.course_id }
		}
	).then(function() {
		res.redirect('/admin/courses')
	})
})

router.get('/:course_id/destroy', function(req, res) {
	models.Course.destroy({
    where: { id: req.params.course_id }
  }).then(function() {
    res.redirect('/admin/courses');
  });
})

var Iconv = require("iconv").Iconv;
var iconv = new Iconv('utf8', 'utf16le');
router.post('/course_details/csv', function(req, res) {
  Promise.all([
		sequelize.query("SELECT Members.*, Cities.City, Areas.Area, Sources.option AS Source_option, Institutions.option AS Institution_option, Industries.option AS Industries_option, Industries2.option AS Industries2_option, Industries3.option AS Industries3_option FROM Course_Members LEFT JOIN Members ON Course_Members.MemberId = Members.id LEFT JOIN Cities ON Members.company_city = Cities.id  LEFT JOIN Areas ON Members.company_area = Areas.id LEFT JOIN Sources ON Members.source = Sources.id LEFT JOIN Institutions ON Members.institution = Institutions.id LEFT JOIN Industries ON Members.company_type1 = Industries.id LEFT JOIN Industries AS Industries2 ON Members.company_type2 = Industries2.id LEFT JOIN Industries AS Industries3 ON Members.company_type3 = Industries3.id WHERE Course_Members.CourseDetailId = "+req.body.course_detail_id)
	]).then(function(values){
		var members = values[0][0]

		var header = "#"+"\t"+"信箱"+"\t"+"手機"+"\t"+"生日"+"\t"+"中文名"+"\t"+"英文或暱稱"+"\t"+"公司"+"\t"+"單位"+"\t"+"統編"+"\t"+"工作地址"+"\t"+"辦公室電話"+"\t"+"部門名稱"+"\t"+"職稱"+"\t"+"產業類別1"+"\t"+"產業類別2"+"\t"+"產業類別3"+"\t"+"消息來源"+"\t"+"訂閱電子報"+"\t"+"推薦人"+"\n";
		var content = header

		for(var i=0; i<members.length; i++) {
			var member_is_enews = members[i].is_enews==1 ? "是" : "否"
			content += (i+1)+"\t"+members[i].email+"\t"+members[i].phone+"\t"+members[i].birthday+"\t"+members[i].name+"\t"+members[i].nickname+"\t"+members[i].company_name+"\t"+members[i].Institution_option+"\t"+members[i].company_id+"\t"+members[i].City+members[i].Area+members[i].company_address+"\t"+members[i].company_phone+"\t"+members[i].department+"\t"+members[i].job_title+"\t"+members[i].Industries_option+"\t"+members[i].Industries2_option+"\t"+members[i].Industries3_option+"\t"+members[i].Source_option+"\t"+member_is_enews+"\t"+members[i].reference+"\n";
		}
		
		res.setHeader('Content-Type',        'application/vnd.openxmlformats');
	  res.setHeader("Content-Disposition", 'attachment; filename=members.xls');
	  res.write(new Buffer([0xff, 0xfe]));
	  res.write(iconv.convert(content));
	  res.end();
	})
});

module.exports = router;