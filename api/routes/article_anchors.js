var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	Promise.all([models.Article_Anchor.findAll(), models.Article.findAll()]).then(function(values){
		res.render('article_anchor', {			
			title: 'article_anchor',
			article_anchors: values[0],
			articles: values[1]
		})
	})
})

router.post('/create', function (req, res) {
	console.log(req.body)
  models.Article_Anchor.create({
  	ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
  	name: req.body.name,
  	anchor: "#"+req.body.name
  }).then(function() {
    res.redirect('/admin/articles/' + req.body.article_id);
  });
});

router.get('/:article_anchor_id/destroy', function (req, res) {
  models.Article_Anchor.destroy({
    where: {
      id: req.params.article_anchor_id
    }
  }).then(function() {
    var backURL=req.header('Referer') || '/';
	  // do your thang
	  res.redirect(backURL);
  });
});

router.post('/update', function (req, res) {
	console.log(req.body)
  models.Article_Anchor.update(
  	{ 
  		ArticleId: req.body.article_id == 0 ? null : req.body.article_id,
	  	name: req.body.name,
	  	anchor: req.body.anchor
  	}, 
  	{ 
  		where: { id: req.body.article_anchor_id }
  	}
  ).then(function() {
    res.redirect('/admin/article_anchors');
  });
});

module.exports = router;