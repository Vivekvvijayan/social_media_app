var express = require('express');

var router = express.Router();

// get database opeartions 
var bcrypt = require('bcrypt');
var saltRounds = 10;
var databaseOps = require('../dboperations');
const dboperations = require('../dboperations');


// chck session existance

function checkSession(req,res,next){

  if(req.session.userId){
    next();
  }
  else{
    res.redirect('/signin');
  }
}

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('partials/index', { admin:false });
});


// get sign in page from server

router.get('/signin',function(req,res,next){

    res.render('partials/signin');

} )


// get signup page from server
router.get('/signup',function(req,res,next){
  res.render('partials/signup');
})


// get post upload page from server


router.get('/upload',function(req,res,next){

  res.render('partials/upload',{ admin:false });


})

router.get('/profile',function(req,res,next){
  res.render('partials/profile',{ admin:false });   
})

// post routes

router.post('/signup',function(req,res,next){


// checking for previous user existance
 databaseOps.checkUserExistance(req.body.email).then(result=>{
  if(result){
    res.render('partials/signup',{ error:"User already exists",status:true });
  }
  else{

bcrypt.genSalt(saltRounds,function(err,salt){
  bcrypt.hash(req.body.password,salt,function(err,hash){



    req.body.password = hash;
    

    databaseOps.doSignup(req.body).then(result=>{

      res.render('partials/signin',{ error:"Registration successfull..",status:true });
    })
  })
})

  }
  })

  });



  // sigin functionality appear here.


  router.post('/signin',function(req,res,next){
    dboperations.doSignin(req.body).then(result=>{

      if(result){

       

        res.render('partials/index',{ admin:true });
      }
      else{
        res.render('partials/signin',{ error:"Invalid email or password",signinErrStatus:true });
      }

    })

  })


module.exports = router;
