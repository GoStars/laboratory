const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// bring in user model
let User = require('../models/user')

// login form
router.get('/login', (req, res) => res.render('login'))

// login process
router.post('/login', (req, res, next) => 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next))

// logout
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Ви вийшли')
    res.redirect('/users/login')
})

// access control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('danger', 'Будь ласка, увійдіть')
        res.redirect('/users/login')
    }
}

module.exports = router