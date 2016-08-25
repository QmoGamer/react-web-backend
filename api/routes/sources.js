var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	models.Source.findAll().then((sources)=>{
		res.render('source', {
			title: 'source',
			sources: sources
		})
	})
})

router.post('/create', function(req, res) {
  models.Source.create({
  	option: req.body.option
  }).then(function() {
    res.redirect('/admin/sources');
  });
});

router.get('/:source_id/destroy', function(req, res) {
  models.Source.destroy({
    where: { id: req.params.source_id }
  }).then(function() {
    res.redirect('/admin/sources');
  });
});

module.exports = router;