var favicon = require('serve-favicon')
var express = require('express');
var path = require('path')
var forceHttps = require('express-force-https');
var proxy = require('express-http-proxy');

var app = express();

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
app.use(favicon(path.join(__dirname, 'static/fav/', 'favicon.ico')))
app.use(forceHttps);

var render = express.response.render;
express.response.render = function(view, options = {}, callback) {
    console.log(options);
    options = {...{
      title: 'Yenny Yulianny | Portfolio',
      styles: [],
      scripts: [],
      layout: "default"
    }, ...options};

    options.contentView = view;

    render.call(this, 'layouts/default', options, callback);
};

app.get('/', function(req, res){
  res.render('index');
});

app.use('/dynamic/img/*', proxy('res.cloudinary.com', {
  proxyReqPathResolver: function (req) {
    const imagePath = req.params[0];
    return `/yulianny/image/upload/${imagePath}`
  }
}));

app.use('/dynamic/:size/img/*', proxy('res.cloudinary.com', {
  proxyReqPathResolver: function (req) {
    const imagePath = req.params[0];
    const size = req.params.size;
    return `/yulianny/image/upload/${size}/v1/${imagePath}`
  }
}));

const pathsWithoutGame = ['mood-mod','onia','pinecrest','sf-gov'];

app.get('/:path', function(req, res){
  res.render(req.params.path, {
  	styles: (pathsWithoutGame.indexOf(req.params.path) !== -1 ? [] : ['game.css']).concat(
  		[`${req.params.path}.css`]
  	)
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + (process.env.PORT || 3000));
  if (!process.env.PORT)
  	console.log('http://localhost:3000/');
});
