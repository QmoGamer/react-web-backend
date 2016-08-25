var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	Promise.all([
		models.Menu.findAll({ order: '`order`' }), 
		models.Article.findAll(), 
		models.Banner.findAll(),
		models.Course.findAll()
	]).then(function(values){
		res.render('menu', {			
			title: 'menu',
			menus: values[0],
			articles: values[1],
			banners: values[2],
			courses: values[3]
		})
	})
})

router.get('/:menu_id', function(req, res){
	Promise.all([
			models.Menu.findOne({ where: { id: req.params.menu_id}, order: '`order`' }), 
			models.Article.findAll(), 
			models.Banner.findAll({ where: { $or: [{ type: ["product", "activity"] }] }}),
			models.Course.findAll()
		]).then(function(values){
			res.render('menu_detail', {			
				title: 'menu_detail',
				menu: values[0],
				articles: values[1],
				banners: values[2],
				courses: values[3]
		})
	})
})

router.post('/create', function (req, res) {
  models.Menu.create({
  	MenuId: req.body.menu_id == 0 ? null : req.body.menu_id,
  	BannerId: req.body.banner_id == 0 ? null : req.body.banner_id,
  	ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
  	CourseId: req.body.course_id == 0 ? null : req.body.course_id,
  	name: req.body.name,
		component: req.body.component,
		customComponent: req.body.customComponent,
		order: req.body.order,
		url: req.body.url
  }).then(function(menu) {
    res.redirect('/admin/menus');
  });
});

router.get('/:menu_id/destroy', function (req, res) {
  models.Menu.destroy({
    where: {
      id: req.params.menu_id
    }
  }).then(function() {
    res.redirect('/admin/menus');
  });
});

router.post('/update', function (req, res) {
  models.Menu.update(
  	{ 
  		MenuId: req.body.menu_id == 0 ? null : req.body.menu_id,
	  	BannerId: req.body.banner_id == 0 ? null : req.body.banner_id,
	  	ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
	  	CourseId: req.body.course_id == 0 ? null : req.body.course_id,
	  	name: req.body.name,
			component: req.body.component,
			customComponent: req.body.customComponent,
			order: req.body.order,
			url: req.body.url
  	}, 
  	{ 
  		where: { id: req.body.id }
  	}
  ).then(function() {
    res.redirect('/admin/menus#'+req.body.id);
  });
});

module.exports = router;