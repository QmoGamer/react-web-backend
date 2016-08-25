var models  = require('../models');
var express = require('express');
var router  = express.Router();
var _ = require('lodash');
var crypto = require('crypto');

var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var website = 'http://www.oitc.com.tw'
var smtp_username = 'webadmin@oitc.com.tw'
var smtp_password = 'Webmin16088678oitc'

router.get('/articles', function(req, res) {
  models.Article.findAll().then(function(articles) {	
		res.json(articles);
	})
})

router.get('/articles/:article_id', function(req, res) {
	Promise.all([
  	models.Article.findOne({ where: { id: req.params.article_id }}),
		models.Article_Anchor.findAll({ where: { ArticleId: req.params.article_id }})
	]).then(function(values) {		
		res.json({article: values[0], anchor: values[1]});
	})
}) 

router.get('/banners/type/:type', function(req, res) {
  models.Banner.findAll({ 
  	where: { type : req.params.type },
  	order:[['order']]
  }).then(function(banners) {	
		res.json(banners);
	})
})

router.get('/banners/:banner_id', function(req, res) {
  models.Banner.findOne({ where: { id : req.params.banner_id } }).then(function(banners) {	
		res.json(banners);
	})
})

router.get('/menus', function(req, res) {
  models.Menu.findAll({ raw: true, order: '`order`' }).then(function(menus) {	
		var tree = unflatten(menus);
		res.json(tree);
	})
})

router.get('/menus/:menu_id', function(req, res) {
  models.Menu.findOne({ 
  	where: { id: req.params.menu_id }
  }).then(function(menu) {	
		res.json(menu);
	})
})

router.get('/footers', function(req, res) {
  models.Footer_Menu.findAll({ 
  	include: [ models.Footer_Second_Menu ],
  	order:[['order'], [{model: models.Footer_Second_Menu},"order"], [{model: models.Footer_Second_Menu},"id"]]
  }).then(function(footer_menus) {	
		res.json(footer_menus);
	})
})

router.get('/footers/:footer_id', function(req, res) {
  models.Footer_Menu.findOne({
  	where: { id: req.params.footer_id },
  	include: [ models.Footer_Second_Menu ],
  	order:[['order'], [{model: models.Footer_Second_Menu},"order"], [{model: models.Footer_Second_Menu},"id"]]
  }).then(function(footer_menus) {	
		res.json(footer_menus);
	})
})

router.get('/courses/:course_id', function(req, res){
	models.Course.findOne({
		where: { id: req.params.course_id }
	}).then(function(course){
		res.json(course)
	})
})

router.get('/configs', function(req, res) {
	models.Config.findAll().then(function(configs) {	
		res.json(configs);
	})
})

router.post('/member/login', function(req, res){
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')
	models.Member.findOne({
		where: { $or: [{ email: req.body.account }, { phone: req.body.account }], password_sha256: hash }
	}).then(function(data) {	
		console.log(data)
		if( data != null )
  		res.json({"state": true, "nickname": data.nickname, "account": data.email, "password": req.body.password})
  	else
  		res.json({"state": false, "error": "1"})
  }).catch(function(data) {
  	res.json({"state": false, "error": "99"})
  })
})

router.post('/member/info', function(req, res){
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')
	models.Member.findOne({
		attributes: ['email', 'phone', 'birthday', 'name', 'nickname', 'institution', 'company_name', 'company_id', 'company_city', 'company_area', 'company_address', 'company_phone', 'department', 'job_title', 'company_type1', 'company_type2', 'company_type3', 'is_enews', 'reference'],
		where: { email: req.body.account, password_sha256: hash }
	}).then(function(data) {
  	res.json({"state": true, "data": data})
  }).catch(function(data) {
  	res.json({"state": false})
  })
})

router.post('/member/create', function(req, res){
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')

	models.Member.findOne({
		where: { email: req.body.email }
	}).then(function(data){
		if(data == null){
		  var transporter = nodemailer.createTransport(smtpTransport({
		      host: "mail.oitc.com.tw",
		      port: 25,
		      auth: {
		        user: smtp_username,
		        pass: smtp_password
		      }
		  }));
		  var mailOptions = {
			    from: smtp_username, // sender address
			    to: req.body.email, // list of receivers
			    bcc: 'candylin@oitc.com.tw',
			    subject: '您已成功加入大塚官方網站會員', // Subject line
			    html: "<font size='4'>歡迎 ~ " + req.body.nickname + " ~ </font>" + "<br />加入大塚官網會員!!!<br /><br/>請再回到大塚官方網站： www.oitc.com.tw<br />並點選右上角會員符號<br />輸入您的E-mail：<br /><font size='4' color='#4285f4'>"+req.body.email+"</font><br />或註冊的手機號碼：<br /><font size='4' color='#4285f4'>"+req.body.phone+"</font><br />皆可登入會員，並可開始使用活動或課程的報名喔！<br /><br />您加入大塚網站會員日期："+new Date().toISOString().split('T')[0]+"<br />目前設定的密碼為："+req.body.password+"<br />"
			};
		  transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		        res.json({"state": false, "error": "此信箱不存在"});
		    }else{
	        models.Member.create({
						email: req.body.email,
						phone: req.body.phone,
						password_sha256: hash,
						birthday: req.body.birthday,
				  	name: req.body.name,
				  	nickname: req.body.nickname,
				  	company_name: req.body.company_name,
				  	company_id: req.body.company_id,
				  	company_city: req.body.company_city,
				  	company_area: req.body.company_area,
				  	company_address: req.body.company_address,
				  	company_phone: req.body.company_phone,
				  	department: req.body.department,
				  	job_title: req.body.job_title,
				  	company_type1: req.body.company_type1,
				  	company_type2: req.body.company_type2,
				  	company_type3: req.body.company_type3,
				  	source: req.body.source,
				  	is_enews: req.body.is_enews,
				  	institution: req.body.institution,
				  	reference: req.body.reference
				  }).then(function(data) {
				  	res.json({"state": true, "nickname": req.body.nickname, "account": req.body.email, "phone": req.body.phone})
				  }).catch(function(data) {
				  	res.json({"state": false, "error": "99"})
				  })
		    };
			});
		}
		else
			res.json({"state": false, "error": "此信箱已被註冊"})
	})
})

router.post('/member/update', function(req, res){
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')

	models.Member.update({ 
		phone: req.body.phone,
		birthday: req.body.birthday,
  	name: req.body.name,
  	nickname: req.body.nickname,
  	company_name: req.body.company_name,
  	company_id: req.body.company_id,
  	company_city: req.body.company_city,
  	company_area: req.body.company_area,
  	company_address: req.body.company_address,
  	company_phone: req.body.company_phone,
  	department: req.body.department,
  	job_title: req.body.job_title,
  	company_type1: req.body.company_type1,
  	company_type2: req.body.company_type2,
  	company_type3: req.body.company_type3,
  	is_enews: req.body.is_enews,
  	institution: req.body.institution,
  	reference: req.body.reference
	}, 
	{ 
		where: { email: req.body.account, password_sha256: hash }
	}).then(function(data) {
		if(data[0] != 0)
  		res.json({"state": true})
  	else
  		res.json({"state": false, "error": "2"})
  }).catch(function(data) {
  	res.json({"state": false, "error": "99"})
  })
})

router.post('/member/change_ps', function(req, res){
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')
	var new_hash = crypto.createHmac('sha256', req.body.new_password).digest('hex')

	models.Member.update(
		{ password_sha256: new_hash }, 
		{ where: { email: req.body.account, password_sha256: hash }	}
	).then(function(data) {
		if(data[0] != 0)
  		res.json({"state": true, "password": req.body.new_password})
  	else
  		res.json({"state": false, "error": "4"})
  }).catch(function(data) {
  	res.json({"state": false, "error": "99"})
  })
})

router.post('/member/inquire_ps', function(req, res){
	// var hash = crypto.createHmac('sha256', req.body.password).digest('hex')
	var array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9']
	var new_password = ""
	for(var i=1; i <= 4; i++){
		var a = array[Math.floor(Math.random() * (array.length - 0)) + 0]
		new_password += a
	}
	var new_hash = crypto.createHmac('sha256', new_password).digest('hex')

	models.Member.update(
		{ password_sha256: new_hash }, 
		{ where: { email: req.body.account } }
		// { where: { email: req.body.account, password_sha256: hash }	}
	).then(function(data) {
		if(data[0] != 0) {
			var account = req.body.account
			var subject = '請重新設定您的會員密碼'
			var text = '<div>親愛的會員您好，您在大塚官網的會員登入帳號為</div><div><font color="#4285f4">'+req.body.account+'</font></div><div>您的新密碼為</div><div><font color="#4285f4">'+new_password+'</font></div><div>請用此新密碼再次登入，即可重新設定您的密碼</div><div><a href="'+website+'/member/signin">大塚官網會員專區</a></div><br/><div>謝謝</div><br/><div>大塚∣客服中心 help@oitc.com.tw</div><br/><div><a href="'+website+'">回大塚官網首頁</a></div>'
			sendMail(req, res, account, text, subject)
		}
  	else
  		res.json({"state": false, "error": "7"})
  }).catch(function(data) {
  	res.json({"state": false, "error": "99"})
  })
})

router.get('/city_data', function(req, res) {
	models.City.findAll().then(function(citys) {
		res.json(citys);
	})
})

router.get('/area_data/:city_id', function(req, res) {
	models.Area.findAll({
		where: { CityId: req.params.city_id }
	}).then(function(areas) {
		res.json(areas);
	})
})

router.get('/industry_data/:industry_id', function(req, res) {
	var industry_id = req.params.industry_id == 0 ? null : req.params.industry_id
	models.Industry.findAll({
		where: { IndustryId: industry_id }
	}).then(function(industrys) {
		res.json(industrys);
	})
})

router.get('/source_data', function(req, res) {
	models.Source.findAll().then(function(sources) {
		res.json(sources);
	})
})

router.get('/institution_data', function(req, res) {
	models.Institution.findAll().then(function(institutions) {
		res.json(institutions);
	})
})

router.get('/activity_list/:menu_id', function(req, res) {
	models.Activity.findAll({
		include: [ models.Banner ],
		//where: { MenuId: req.params.menu_id, is_show: 1, start_time: { $lte: new Date()}, end_time: {$gte: new Date()} }
		where: { MenuId: req.params.menu_id }
	}).then(function(activitys){
		res.json(activitys)
	})
})

router.get('/activitys/:activity_id', function(req, res) {
	models.Activity.findOne({
		where: { id: req.params.activity_id }
	}).then(function(activitys){
		res.json(activitys)
	})
})

router.get('/activity_details/:activity_id', function(req, res) {
	sequelize.query("SELECT Activity_Details.*, COUNT(Activity_Members.MemberId) AS members FROM Activity_Details LEFT JOIN Activity_Members ON Activity_Details.id = Activity_Members.ActivityDetailId WHERE Activity_Details.ActivityId = "+req.params.activity_id+" GROUP BY Activity_Details.id").then(function(activity_details){
	  res.json(activity_details)
	})
})

router.get('/activity_details/detail/:activity_detail_id', function(req, res) {
	models.Activity_Detail.findOne({
		where: { id: req.params.activity_detail_id }
	}).then(function(activity_details){
		res.json(activity_details)
	})
})

router.get('/course_details/:course_id', function(req, res) {
	sequelize.query("SELECT Course_Details.*, COUNT(Course_Members.MemberId) AS members FROM Course_Details LEFT JOIN Course_Members ON Course_Details.id=Course_Members.CourseDetailId WHERE Course_Details.CourseId = "+req.params.course_id+" GROUP BY Course_Details.id").then(function(course_details){
	  res.json(course_details)
	})
})

router.get('/course_details/detail/:course_detail_id', function(req, res) {
	models.Course_Detail.findOne({
		where: { id: req.params.course_detail_id }
	}).then(function(course_details){
		res.json(course_details)
	})
})

router.post('/signup/course', function(req, res) {
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')

	models.Course_Member.findAndCountAll({
		where: { CourseDetailId: req.body.course_detail_id }
	}).then(function(count){
		models.Course_Detail.findOne({
			where: { id: req.body.course_detail_id }
		}).then(function(data){
			var course_name = data.name
			var course_area = data.area
			var course_date = data.course_date
			var google_url = data.google_url
			if(count.count < data.number_of_people) {
				models.Member.findOne({
					where: { email: req.body.account, password_sha256: hash }
				}).then(function(member){
					var member_nickname = member.nickname
					models.Course_Member.findOne({
						where: { MemberId: member.id, CourseDetailId: req.body.course_detail_id }
					}).then(function(data){
						models.Course_Member.create({
							MemberId: member.id,
							CourseDetailId: req.body.course_detail_id
					  }).then(function(data) {	  	
					  	var account = req.body.account
					  	var subject = '您已完成報名'+course_name
					  	var text = '<div><font size="4">歡迎 ~ '+member_nickname+' ~</font></div><div>即將參加大塚的課程，課程重要訊息如下</div><br/><div>課程名稱: <font size="4" color="#4285f4">'+course_name+'</font></div><div>日期時間: <font color="#f90">'+course_date+'</font></div><div>課程地點: '+course_area+'</div><div>地圖資訊: <a href="'+google_url+'">Google地圖資訊連結</a></div><br/><a href="'+website+'">回大塚官方網站</a><br/><div>大塚∣教育訓練學苑 oitcsl@oitc.com.tw</div>'
					  	sendMailCourse(req, res, account, text, subject)
					  }).catch(function(data) {
					  	res.json({"state": false, "error": "11"})
					  })
					})
				}).catch(function(data){
					res.json({"state": false, "error": "99"})
				})
			}
			else 
				res.json({"state": false, "error": "12"})
		}).catch(function(data){
			res.json({"state": false, "error": "99"})
		})
	})	
})

router.post('/signup/activity', function(req, res) {
	var hash = crypto.createHmac('sha256', req.body.password).digest('hex')

	models.Activity_Member.findAndCountAll({
		where: { ActivityDetailId: req.body.activity_detail_id }
	}).then(function(count){
		models.Activity_Detail.findOne({
			where: { id: req.body.activity_detail_id }
		}).then(function(data){
			var activity_name = data.name
			var activity_area = data.area
			var activity_date = data.activity_date
			var activity_location = data.location
			var google_url = data.google_url
			if(count.count < data.number_of_people) {
				models.Member.findOne({
					where: { email: req.body.account, password_sha256: hash }
				}).then(function(member){
					var member_nickname = member.nickname
					models.Activity_Member.findOne({
						where: { MemberId: member.id, ActivityDetailId: req.body.activity_detail_id }
					}).then(function(data){
						models.Activity_Member.create({
							MemberId: member.id,
							ActivityDetailId: req.body.activity_detail_id
					  }).then(function(data) {	  	
					  	var account = req.body.account
					  	var subject = '您已完成報名'+activity_name
					  	var text = '<div><font size="4">歡迎 ~ '+member_nickname+' ~</font></div><div>即將參加大塚的活動，活動重要訊息如下</div><br/><div>活動名稱: <font size="4" color="#4285f4">'+activity_name+'</font></div><div>日期時間: <font color="#f90">'+activity_date+'</font></div><div>活動地點: '+activity_area+'</div><div>活動地址: '+activity_location+'</div><div>地圖資訊: <a href="'+google_url+'">Google地圖資訊連結</a></div><br/><a href="'+website+'">回大塚官方網站</a><br/><div>大塚∣行銷促進部 oitcmkt@oitc.com.tw</div>'
					  	sendMailActivity(req, res, account, text, subject)
					  }).catch(function(data) {
					  	res.json({"state": false, "error": "11"})
					  })
					})
				}).catch(function(data){
					res.json({"state": false, "error": "99"})
				})
			}
			else 
				res.json({"state": false, "error": "12"})
		}).catch(function(data){
			res.json({"state": false, "error": "99"})
		})
	})	
})

router.get('/home_ads', function(req, res) {
	models.Home_Ad.findAll().then(function(data) {
		res.json(data)
	})
})

function unflatten( array, parent, tree ){   
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { id: null };
        
    var children = _.filter( array, function(child){ return child.MenuId == parent.id; });
    if( !_.isEmpty( children )  ){
        if( parent.id == null ){
           tree = children;   
        }else{
           parent['children'] = children
        }
        _.each( children, function( child ){ unflatten( array, child ) } );                    
    }
    return tree;
}

//寄信
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

router.post('/send_mail', function(req, res){
	var account = req.body.account
	var text = req.body.text
	sendMail(req, res, account, text)
}); // handle the route at yourdomain.com/sayHello

function sendMail(req, res, account, text, subject) {
  // Not the movie transporter!
  var transporter = nodemailer.createTransport(smtpTransport({
      host: "mail.oitc.com.tw",
      port: 25,
      auth: {
        user: smtp_username,
        pass: smtp_password
      }
  }));
  var text = text;
  var mailOptions = {
	    from: smtp_username, // sender address
	    to: account, // list of receivers
	    subject: subject, // Subject line
	    html: text //, // plaintext body
	    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({"state": false});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({"state": true});
    };
	});
}

router.post('/online_msg', function(req, res) {
	var account = req.body.account
	var text = req.body.text
	onlineMsg(req, res, account, text)
})

function onlineMsg(req, res, account, text) {
	// Not the movie transporter!
  var transporter = nodemailer.createTransport(smtpTransport({
      host: "mail.oitc.com.tw",
      port: 25,
      auth: {
        user: smtp_username,
        pass: smtp_password
      }
  }));
  var text = text;
  var mailOptions = {
	    from: account, // sender address
	    to: "oitcsub@oitc.com.tw", // list of receivers
	    subject: '大塚官網留言通知', // Subject line
	    html: text //, // plaintext body
	    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({"state": false});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({"state": true});
    };
	});

}

function sendMailCourse(req, res, account, text, subject) {
  // Not the movie transporter!
  var transporter = nodemailer.createTransport(smtpTransport({
      host: "mail.oitc.com.tw",
      port: 25,
      auth: {
        user: smtp_username,
        pass: smtp_password
      }
  }));
  var text = text;
  var mailOptions = {
	    from: 'oitcsl@oitc.com.tw', // sender address
	    to: account, // list of receivers
	    bcc: 'oitcsl@oitc.com.tw',
	    subject: subject, // Subject line
	    html: text //, // plaintext body
	};
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({"state": false});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({"state": true});
    };
	});
}

function sendMailActivity(req, res, account, text, subject) {
  // Not the movie transporter!
  var transporter = nodemailer.createTransport(smtpTransport({
      host: "mail.oitc.com.tw",
      port: 25,
      auth: {
        user: smtp_username,
        pass: smtp_password
      }
  }));
  var text = text;
  var mailOptions = {
	    from: 'oitcmkt@oitc.com.tw', // sender address
	    to: account, // list of receivers
	    bcc: 'oitcmkt@oitc.com.tw',
	    subject: subject, // Subject line
	    html: text //, // plaintext body
	};
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({"state": false});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({"state": true});
    };
	});
}
module.exports = router