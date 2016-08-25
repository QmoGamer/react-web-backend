var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	models.Industry.findAll().then((industrys)=>{
		res.render('industry', {
			title: 'industry',
			industrys: industrys
		})
	})
})

router.post('/create', function (req, res) {
  models.Industry.create({
  	option: req.body.option,
		IndustryId: req.body.industry_id != 0 ? req.body.industry_id : null
  }).then(function(menu) {
    res.redirect('/admin/industrys');
  });
});

router.get('/:industry_id/destroy', function (req, res) {
  models.Industry.destroy({
    where: {
      id: req.params.industry_id
    }
  }).then(function() {
    res.redirect('/admin/industrys');
  });
});

module.exports = router;