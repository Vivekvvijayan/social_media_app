var express = require('express');
const path = require('path')
const url = require('url')

var router = express.Router();

// multer configuration
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(null, file.fieldname + '-' + Date.now() + ext);


  }


})

storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/posts/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
})
const multerFilter = (req, file, cb) => {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  }
  else {
    cb(null, false);
    return cb(new Error('Only jpg and png are allowed'));
  }
}
const upload = multer({
  storage: storage,
  fileFilter: multerFilter
})

const postUpload = multer({
  storage: storageB,
  fileFilter: multerFilter

})

// get database opeartions 
var bcrypt = require('bcrypt');
var saltRounds = 10;
var databaseOps = require('../dboperations');
const dboperations = require('../dboperations');

var postHolder;
var eligibility;

// chck session existance

function checkSession(req, res, next) {

  if (req.session.isLoggedIn) {

    next();
  }
  else {
    res.redirect('/signin');
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {

  dboperations.getAllPosts().then(result => {

    if (result.length > 0) {


      res.render('partials/index', { admin: req.session.isLoggedIn, post: true, posts: result });
    }
    else {
      
      res.render('partials/index', { admin: req.session.isLoggedIn, post: false });

    }
  }).catch(err => {
    console.log(err);
  })

});


// get sign in page from server

router.get('/signin', function (req, res, next) {

  res.render('partials/signin');

})


// get signup page from server
router.get('/signup', function (req, res, next) {
  res.render('partials/signup');
})

// get dahsbard page

router.get('/dashboard', checkSession, function (req, res, next) {
  res.render('partials/dashboard', { admin: req.session.isLoggedIn });
})


router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
})

// get vew profile page

router.get('/view-profile', function (req, res, next) {

  dboperations.getUserProfile(req.session.userId).then(result => {


    res.render('partials/viewProfile', { user: result, admin: req.session.isLoggedIn });
  })


})


// get post upload page from server


router.get('/upload', checkSession, function (req, res, next) {

  res.render('partials/upload', { admin: req.session.isLoggedIn });


})

router.get('/profile', checkSession, function (req, res, next) {
  res.render('partials/profile', { userName: req.session.userId, admin: req.session.isLoggedIn });
})




// get update profile page


router.get('/update-profile', function (req, res, next) {

  res.render('partials/update-profile', { admin: req.session.isLoggedIn })


})

// get delete account page

router.get('/delete-accound', function (req, res, next) {


  dboperations.deleteUser(req.session.userId).then(result => {

    req.session.destroy();
    res.redirect('/signin');

  }).catch(err => {

    console.log(err);
  })



})


// post routes

router.post('/update-profile', upload.single('new_profile_picture'), function (req, res, next) {

  const new_profile_data = {


    new_user_name: req.body.new_user_name,
    new_profile_picture: req.file.filename

  }


  dboperations.updateUserProfile(req.session.userId, new_profile_data).then(result => {

    if (result) {
      res.redirect('/dashboard');
    }
    else {
      res.send('error');
    }
  }).catch(err => {
    console.log(err);
  })

})




router.post('/signup', function (req, res, next) {


  // checking for previous user existance
  databaseOps.checkUserExistance(req.body.email).then(result => {
    if (result) {
      res.render('partials/signup', { error: "User already exists", status: true });
    }
    else {

      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {



          req.body.password = hash;


          databaseOps.doSignup(req.body).then(result => {

            res.render('partials/signin', { error: "Registration successfull..", status: true });
          })
        })
      })

    }
  })

});



// sigin functionality appear here.


router.post('/signin', function (req, res, next) {
  dboperations.doSignin(req.body).then(result => {

    if (result) {
      // setting session storage

      req.session.userId = result.email;
      req.session.isLoggedIn = true;

      res.redirect('/');

    }
    else {
      res.render('partials/signin', { error: "Invalid email or password", signinErrStatus: true });
    }

  }).catch(err => {
    res.render('partials/signin', { error: "Invalid email or password", signinErrStatus: true });
  })

})


// profile generation functionality


router.post('/createProfile', checkSession, upload.single('profile_image'), function (req, res, next) {

  dboperations.checkProfileExistance(req.session.userId).then(result => {

    if (result) {

      res.render('partials/profile', { error: "Profile already exists", status: true, admin: req.session.isLoggedIn });
    }
    else {
      const profileData = {
        email: req.session.userId,

        username: req.body.username,
        profile_image: req.file.filename,
        district: req.body.district,
        eligibility: req.body.eligibility,
      }


      databaseOps.createProfile(profileData).then(result => {


        if (result) {



          res.redirect('/dashboard');
        }
        else {
          res.send(new Error('Error in creating profile'));

        }



      }).catch(err => {
        console.log(err);
      })

    }

  }).catch(err => {
    console.log(err)
  })

})
// upload post functionality

router.post('/upload-post', checkSession, postUpload.single('post_image'), function (req, res, next) {



  dboperations.fetchProfile(req.session.userId).then(result => {


    postHolder = result.username;
    profile_image_url = result.profile_image;
    eligibility = result.eligibility;
    console.log(eligibility);

    const postDetails = {

      email: req.session.userId,
      user_name: postHolder,
      accound_profile_image: profile_image_url,
      post_image: req.file.filename,
      job: eligibility,
      postedDate: new Date().toLocaleDateString(),
      postedTime: new Date().getHours() + ":" + new Date().getMinutes()

    }


    databaseOps.uploadPost(postDetails).then(result => {

      if (result) {

        res.render('partials/dashboard', { admin: req.session.isLoggedIn, postingStatus: true });
      }
      else {
        res.send(new Error('Error in uploading post'));
        res.redirect('/upload');

      }
    }).catch(err => {
      console.log(err);
    }
    )





  }).catch(err => {
    console.log(err)
  })






})


module.exports = router;
