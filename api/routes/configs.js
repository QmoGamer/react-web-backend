var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	models.Config.findAll().then(function(configs) {
		console.log(configs)
		res.render('config', {			
			title: 'config',
			configs: configs
		})
	})
})

router.post('/create', function (req, res) {
  models.Config.create({
  	name: req.body.name,
  	value: req.body.value
  }).then(function() {
    res.redirect('/admin/configs');
  });
});

router.get('/:config_id/destroy', function (req, res) {
  models.Config.destroy({
    where: {
      id: req.params.config_id
    }
  }).then(function() {
    res.redirect('/admin/configs');
  });
});

router.post('/update', function (req, res) {
	console.log(req.body)
  models.Config.update(
  	{ 
  		name: req.body.name,
  		value: req.body.value
  	}, 
  	{ 
  		where: { id: req.body.config_id }
  	}
  ).then(function() {
    res.redirect('/admin/configs');
  });
});


module.exports = router;