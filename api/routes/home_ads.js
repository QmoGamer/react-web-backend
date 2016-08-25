var models  = require('../models');
var express = require('express');
var router  = express.Router();
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var fs = require('fs')
var uuid = require('node-uuid')

router.get('/', function(req, res) {
	models.Home_Ad.findAll().then(function(data) {
		res.render('home_ad', {			
			title: 'home_ad',
			home_ads: data
		})
	})
})

router.post('/update', upload.single('UploadFile'), function (req, res) {
	if(req.file) {
		if(req.file.mimetype == "image/jpeg")
	  	var ext = ".jpg"
	  else if(req.file.mimetype == "image/png")
	  	var ext = ".png"
	  else {
			res.send("file format error !")
			return
		}		

		var name =  "home_ad-" + uuid.v1().split('-')[0] + ext
		var path_name = '/upload/' + name

		fs.exists('public'+path_name, (exists) => {
			if(exists) {
				res.send("file exist !")
				return
			}
		});
	}
	
  models.Home_Ad.update(
  	{ 
  		url: req.body.url,
  	  img: path_name,
  	  text: req.body.text
  	}, 
  	{ 
  		where: { id: req.body.home_ad_id }
  	}
  ).then(function() {
  	if(req.file) {
	    fs.writeFile('public' + path_name, req.file.buffer, (err) => { 
	  		if(err) {
	  			res.send(err)
	  			return
	  		}	  
	  	})
  	}
  	res.redirect('/admin/home_ads');
  });
});

module.exports = router;