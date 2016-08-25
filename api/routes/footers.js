var models  = require('../models');
var express = require('express');
var router  = express.Router();
var _ = require('lodash');

router.get('/', function(req, res) {
	Promise.all([
		models.Footer_Menu.findAll({
	    include: [ models.Footer_Second_Menu ],
	    order:[['order'], [{model: models.Footer_Second_Menu},"order"], [{model: models.Footer_Second_Menu},"id"]]
	  }), 
	  models.Article.findAll({ where: { category: 4 } })
	]).then(function(value) {
    res.render('footer', {			
			title: 'footer',
			footer_menus: value[0],
			articles: value[1]
		})
  })
})

router.post('/create', function (req, res) {
  models.Footer_Menu.create({
  	name: req.body.name,
  	order: req.body.order
  }).then(function() {
    res.redirect('/admin/footers');
  });
});

router.post('/footer_second/create', function (req, res) {
  models.Footer_Second_Menu.create({
  	FooterMenuId: req.body.footer_menu_id,
  	name: req.body.name,
  	order: req.body.order,
  	is_url: req.body.is_url,
  	url: req.body.url,
  	ArticleId: req.body.article_id != 0 ? req.body.article_id : null
  }).then(function() {
    res.redirect('/admin/footers');
  });
});

router.post('/update', function (req, res) {
  models.Footer_Menu.update(
  	{ 
	  	name: req.body.name,
	  	order: req.body.order
  	}, 
  	{ 
  		where: { id: req.body.footer_menu_id }
  	}
  ).then(function() {
    res.redirect('/admin/footers');
  });
});

router.post('/footer_second/update', function (req, res) {
  models.Footer_Second_Menu.update(
  	{ 
	  	name: req.body.name,
	  	order: req.body.order,
	  	is_url: req.body.is_url,
	  	url: req.body.url,
	  	ArticleId: req.body.article_id != 0 ? req.body.article_id : null
  	}, 
  	{ 
  		where: { id: req.body.footer_second_menu_id }
  	}
  ).then(function() {
    res.redirect('/admin/footers');
  });
});

router.get('/:footer_menu_id/destroy', function (req, res) {
  models.Footer_Menu.destroy({
    where: {
      id: req.params.footer_menu_id
    }
  }).then(function() {
    res.redirect('/admin/footers');
  });
});

router.get('/footer_second/:footer_second_menu_id/destroy', function (req, res) {
  models.Footer_Second_Menu.destroy({
    where: {
      id: req.params.footer_second_menu_id
    }
  }).then(function() {
    res.redirect('/admin/footers');
  });
});

module.exports = router;