var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'dy生成器'});
});
router.get('/project', function(req, res, next) {
  res.render('project', { title: 'dy生成器'});
});
module.exports = router;
