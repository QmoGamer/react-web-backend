var models  = require('../models');
var express = require('express');
var router  = express.Router();
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var fs = require('fs')
var uuid = require('node-uuid')

router.get('/', function(req, res) {
	models.Article.findAll({ order: 'createdAt DESC' }).then(function(articles) {
		res.render('article', {			
			title: 'article',
			articles: articles
		})
	})
})

router.get('/:article_id', function(req, res) {
	Promise.all([
		models.Img.findAll({ where: { ArticleId: req.params.article_id } }), 
		models.Article.findOne({ where: { id: req.params.article_id }}),
		models.Article_Anchor.findAll({ where: { ArticleId: req.params.article_id }})
	]).then(function(values){
		res.render('article_id', {			
			title: 'article_id',
			imgs: values[0],
			article: values[1],
			article_anchors: values[2]
		})
	})
})

router.post('/create', function (req, res) {
  models.Article.create({
  	name: req.body.name
  }).then(function() {
    res.redirect('/admin/articles');
  });
});

router.get('/:article_id/destroy', function (req, res) {
  models.Article.destroy({
    where: {
      id: req.params.article_id
    }
  }).then(function() {
    res.redirect('/admin/articles');
  });
});

router.post('/update', function (req, res) {
  models.Article.update(
  	{ 
  		name: req.body.name,
  		content: req.body.content,
  		category: req.body.category
  	}, 
  	{ 
  		where: { id: req.body.article_id }
  	}
  ).then(function() {
    res.redirect('/admin/articles/'+req.body.article_id);
  });
});

router.post('/upload', upload.single('UploadFile'), function (req, res) {
  if(req.file) {
    if(req.file.mimetype == "image/jpeg")
    	var ext = ".jpg"
    else if(req.file.mimetype == "image/png")
    	var ext = ".png"
    else {
			res.send("file format error !")
			return
		}		

		var name =  "img-" + req.body.article_id + "-" + uuid.v1().split('-')[0] + ext
		var path_name = '/upload/' + name

		fs.exists('public'+path_name, (exists) => {
			if(exists) {
				res.send("file exist !")
				return
			}
		});
	}

	models.Img.create({
		ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
  	name: req.file.originalname,
  	path: path_name
  }).then(function(obj) {
  	if(req.file) {
    	fs.writeFile('public' + path_name, req.file.buffer, (err) => { 
    		if(err) {
    			res.send(err)
    			return
    		}
    	})
    }
    res.redirect('/admin/articles/'+req.body.article_id);	    
  })
})

router.get('/:article_id/img/:img_id/destroy', function (req, res) {
	console.log(req.body)
  models.Img.destroy({
    where: {
      id: req.params.img_id
    }
  }).then(function() {
  	res.redirect('/admin/articles/'+req.params.article_id)
  })
});

/*router.post('/create', upload_image.single('banner'), function(req, res) {
  var type = req.file.originalname.split(".")[1];
  console.log(req.file);
  models.Form.create({
    name: req.body.name,
    banner: "banner." + type,
    creator: req.body.creator
  }).then(function() {
    fs.mkdir('build/forms/', (err) => {
      fs.mkdir('build/forms/' + req.body.name,(err)=>{
        fs.writeFile('build/forms/' + req.body.name + '/banner.' + type, req.file.buffer, (err) => {
            if (err) throw err;
            res.send('ok!');
        });
      });
    });
  });
});*/

module.exports = router;