
const express = require('express');
const router = express.Router();
const {checkIsAuthenticated, checkNotAuthenticated }  = require('../middleware/auth');
const passport = require('passport');
const User = require('../models/user');




router.delete('/', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
})

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('signup')
})
router.post('/register',checkNotAuthenticated,  async(req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
    await newUser.save()
    .then( user => res.redirect('/user/login'))
    .catch(err => res.redirect('/user/register'));

})


router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})
router.post('/login', checkNotAuthenticated, function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.redirect('/user/login'); }
      if (!user) {  return res.redirect('/user/login'); }

      req.logIn(user, function(err) {
        if (err) { 
            return res.redirect('/user/login');
         }
        return res.redirect('/home');

      });
    })(req, res, next);
  });

module.exports = router;