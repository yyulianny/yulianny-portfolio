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

const passwordProtextedPaths = ['/iq-campaign', '/creval'];

app.use((req, res, next) => {
  if (passwordProtextedPaths.includes(req.path)) {
    const auth = { login: 'product', password: 'product' };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');

    if (
      login &&
      password &&
      login === auth.login &&
      password === auth.password
    ) {
      return next();
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
    res.status(401).send('Authentication required.'); // custom message
  } else {
    next();
  }
});

const productDomains = [
  'localhost2',
  'yennyyulianny.com',
  'www.yennyyulianny.com',
];
const Sites = {
  MAIN: 'main',
  PRODUCT: 'product'
};

app.use((req, res, next) => {
  res.locals.site = productDomains.includes(req.host) ? Sites.PRODUCT : Sites.MAIN;
  res.locals.siteFolder = res.locals.site === Sites.PRODUCT ? 'product/' : '';
  next();
});

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
    console.log('view', view);

    render.call(this, 'layouts/default', options, callback);
};

app.get('/', function(req, res){
  res.render(`${res.locals.siteFolder}index`, {
    useNewCss: false,
  });
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
    styles: (pathsWithoutGame.indexOf(req.params.path) !== -1
      ? []
      : ['game.css']
    ).concat([`${req.params.path}.css`]),
    useNewCss: ['iq-campaign', 'creval'].indexOf(req.params.path) !== -1,
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + (process.env.PORT || 3000));
  if (!process.env.PORT)
  	console.log('http://localhost:3000/');
});
