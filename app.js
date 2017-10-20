const express          = require('express');
const path             = require('path');
const pagesRoutes      = require('./routes/pages');
const adminPagesRoutes = require('./routes/admin_pages');
const bodyParser       = require('body-parser');
const session          = require('express-session');
const validator        = require('express-validator');

const app = express();

// Configure views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure static file folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Set global errors variable
app.locals.errors = null;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

// Configure express-validator middleware
app.use(validator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += '{' + namespace.shift() + '}';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Configure express-messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', pagesRoutes);
app.use('/admin', adminPagesRoutes);

app.listen(3000, () => {
  console.log('Server started on port', 3000);
});
