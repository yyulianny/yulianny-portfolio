var favicon = require('serve-favicon')
var express = require('express');
var path = require('path')
var forceHttps = require('express-force-https');

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
