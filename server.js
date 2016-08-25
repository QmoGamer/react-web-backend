/* eslint no-console: 0 */

import "babel-polyfill";
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('http-auth');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

var routes  = require('./api/routes/index');
var users   = require('./api/routes/users');
var menus  	= require('./api/routes/menus');
var configs = require('./api/routes/configs');
var banners = require('./api/routes/banners');
var articles = require('./api/routes/articles');
var article_anchors = require('./api/routes/article_anchors');
var footers = require('./api/routes/footers');
var members = require('./api/routes/members')
var courses = require('./api/routes/courses')
var activitys = require('./api/routes/activitys')
var home_ads = require('./api/routes/home_ads')
var industrys = require('./api/routes/industrys')
var sources = require('./api/routes/sources')
var institutions = require('./api/routes/institutions')
var json = require('./api/routes/json');

// view engine setup
app.set('views', path.join(__dirname, '/api/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var basic = auth.basic({
        realm: "Simon Area."
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "qmo" && password === "qmo");
    }
);
app.use('/admin/*', auth.connect(basic));

app.use('/admin/', routes);
app.use('/admin/users', users);
app.use('/admin/menus', menus);
app.use('/admin/configs', configs);
app.use('/admin/banners', banners);
app.use('/admin/articles', articles);
app.use('/admin/article_anchors', article_anchors);
app.use('/admin/footers', footers);
app.use('/admin/members', members);
app.use('/admin/courses', courses);
app.use('/admin/activitys', activitys);
app.use('/admin/home_ads', home_ads);
app.use('/admin/industrys', industrys);
app.use('/admin/sources', sources);
app.use('/admin/institutions', institutions);
app.use('/api/json', json);

var models = require("./api/models");
models.sequelize.sync()

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(express.static('public'));
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

module.exports = app;
