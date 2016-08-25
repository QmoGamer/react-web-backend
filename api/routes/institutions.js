var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	models.Institution.findAll().then((institutions)=>{
		res.render('institution', {
			title: 'institution',
			institutions: institutions
		})
	})
})

router.post('/create', function(req, res) {
  models.Institution.create({
  	option: req.body.option
  }).then(function() {
    res.redirect('/admin/institutions');
  });
});

router.get('/:institution_id/destroy', function (req, res) {
  models.Institution.destroy({
    where: { id: req.params.institution_id }
  }).then(function() {
    res.redirect('/admin/institutions');
  });
});

module.exports = router;