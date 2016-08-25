var models  = require('../models');
var express = require('express');
var router  = express.Router();
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var fs = require('fs')
var uuid = require('node-uuid')

router.get('/', function(req, res) {
	Promise.all([
		models.Banner.findAll({ order: 'createdAt DESC' }), 
		models.Article.findAll()
	]).then(function(values){
		res.render('banner_list', {			
			title: 'banner_list',
			banners: values[0],
			articles: values[1]
		})
	})
})

router.get('/:banner_id', function(req, res) {
	models.Banner.findOne({ where: {id: req.params.banner_id} }).then(function(banner) {		
		res.render('banner', {			
			title: 'banner',
			banner: banner
		})
	})
})

router.post('/create', function(req, res){
	models.Banner.create({
  	name: req.body.name
  }).then(function() {
  	res.redirect('/admin/banners')
  })
})
/*router.post('/create', upload.single('UploadFile'), function (req, res) {
	if(req.file.mimetype == "image/jpeg")
  	var ext = ".jpg"
  else if(req.file.mimetype == "image/png")
  	var ext = ".png"
  else {
		res.send("file format error !")
		return
	}		

	var name =  "banner-" + uuid.v1().split('-')[0] + ext
	var path_name = '/upload/' + name

	fs.exists('public'+path_name, (exists) => {
		if(exists) {
			res.send("file exist !")
			return
		}
	});

  models.Banner.create({
  	ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
  	name: req.body.name,
  	type: req.body.type,
  	img: path_name,
  	text: req.body.text,
  	text_top: req.body.text_top,
  	text_left: req.body.text_left
  }).then(function() {
  	fs.writeFile('public' + path_name, req.file.buffer, (err) => { 
  		if(err) {
  			res.send(err)
  			return
  		}
  		res.redirect('/admin/banners');
  	})    
  });
});*/

router.get('/:banner_id/destroy', function (req, res) {
  models.Banner.destroy({
    where: {
      id: req.params.banner_id
    }
  }).then(function() {
    res.redirect('/admin/banners');
  });
});

router.post('/update', function(req, res){
	models.Banner.update(
  	{ 
  		ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
  		name: req.body.name,
  	  type: req.body.type,
  	  order: req.body.order,
  	  url: req.body.url,
  	  text: req.body.text,
  	  text_top: req.body.text_top,
  	  text_left: req.body.text_left,
  	  category: req.body.category
  	}, 
  	{ 
  		where: { id: req.body.banner_id }
  	}
  ).then(function(){
  	res.redirect('/admin/banners/'+req.body.banner_id);
  })
})
/*router.post('/update', upload.single('UploadFile'), function (req, res) {
	if(req.file) {
		if(req.file.mimetype == "image/jpeg")
	  	var ext = ".jpg"
	  else if(req.file.mimetype == "image/png")
	  	var ext = ".png"
	  else {
			res.send("file format error !")
			return
		}		

		var name =  "banner-" + uuid.v1().split('-')[0] + ext
		var path_name = '/upload/' + name

		fs.exists('public'+path_name, (exists) => {
			if(exists) {
				res.send("file exist !")
				return
			}
		});
	}
	
  models.Banner.update(
  	{ 
  		ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
  		name: req.body.name,
  	  type: req.body.type,
  	  img: path_name,
  	  text: req.body.text,
  	  text_top: req.body.text_top,
  	  text_left: req.body.text_left
  	}, 
  	{ 
  		where: { id: req.body.banner_id }
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
  	res.redirect('/admin/banners');
  });
});*/

router.post('/update_img', upload.single('UploadFile'), function (req, res) {
	if(req.file) {
		if(req.file.mimetype == "image/jpeg")
	  	var ext = ".jpg"
	  else if(req.file.mimetype == "image/png")
	  	var ext = ".png"
	  else {
			res.send("file format error !")
			return
		}		

		var name =  "banner-" + uuid.v1().split('-')[0] + ext
		var path_name = '/upload/' + name

		fs.exists('public'+path_name, (exists) => {
			if(exists) {
				res.send("file exist !")
				return
			}
		});
	}
	
  models.Banner.update(
  	{ 
  	  img: path_name
  	}, 
  	{ 
  		where: { id: req.body.banner_id }
  	}
  ).then(function() {
  	if(req.file) {
	    fs.writeFile('public' + path_name, req.file.buffer, (err) => { 
	  		if(err) {
	  			res.send(err)
	  			return
	  		}	  
	  	})
	  	res.redirect('/admin/banners/'+req.body.banner_id)
  	}
  });
})

router.post('/update_mobile_img', upload.single('UploadFileMobile'), function (req, res) {
	if(req.file) {
		if(req.file.mimetype == "image/jpeg")
	  	var ext = ".jpg"
	  else if(req.file.mimetype == "image/png")
	  	var ext = ".png"
	  else {
			res.send("file format error !")
			return
		}		

		var name =  "banner-mobile-" + uuid.v1().split('-')[0] + ext
		var path_name = '/upload/' + name

		fs.exists('public'+path_name, (exists) => {
			if(exists) {
				res.send("file exist !")
				return
			}
		});
	}
	
  models.Banner.update(
  	{ 
  	  mobile_img: path_name
  	}, 
  	{ 
  		where: { id: req.body.banner_id }
  	}
  ).then(function() {
  	if(req.file) {
	    fs.writeFile('public' + path_name, req.file.buffer, (err) => { 
	  		if(err) {
	  			res.send(err)
	  			return
	  		}	  
	  	})
	  	res.redirect('/admin/banners/'+req.body.banner_id)
  	}
  });
})

module.exports = router;