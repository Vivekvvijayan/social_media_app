var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var session = require('express-session')


var indexRouter = require('./routes/index');

var mongodb = require('./db');



var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({
  defaultLayout:'main',
  extname:'hbs',
  layoutsDir:__dirname+'/views/layout/',
  partialsDir:__dirname+'/views/partials/'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static('public'));

app.use(session({
  secret:'vivek@123',
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge:1000*60*60*24,
 
    secure:false,
    
  }
})
)
app.use('/', indexRouter);

// session setup in server side



// database connection establishing section

mongodb.connect((err)=>{
  if(err) {
    console.log('connection err',err);

  }
  else{
    console.log('Database connected');
    
    
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
