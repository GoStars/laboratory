const express = require('express')

const router = express.Router()

// home model
let Home = require('../models/home')
// user model
let User = require('../models/user')

// add route
router.get('/add', ensureAuthenticated, (req, res) => 
    res.render('add_home', {title: 'Додати опис'}))
// add submit post route
router.post('/add', (req, res) => {
    // req.checkBody('title', 'Назва обов\'язкова').notEmpty()
    // req.checkBody('author', 'Author is required').notEmpty()
    req.checkBody('body', 'Тіло обов\'язкове').notEmpty()
    // get errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('add_home', {title: 'Додати опис', errors})
    } else {
        let home = new Home()
        home.author = req.user._id
        home.body = req.body.body  
        home.save(err => {
            if (err) {
                console.log(err)
                return
            } else {
                req.flash('success', 'Опис додано')
                res.redirect('/')
            }
        })
    }
})
// load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => 
    Home.findById(req.params.id, (err, home) => {
        if (home.author != req.user._id) {
            req.flash('danger', 'Не авторизований')
            res.redirect('/')
        }
        res.render('edit_home', {title: 'Редагувати опис', home})
    }))
// Update submit post route
router.post('/edit/:id', (req, res) => {
    let home = {}
    home.author = req.body.author
    home.body = req.body.body  
    let query = {_id: req.params.id}
    Home.update(query, home, err => {
        if (err) {
            console.log(err)
            return
        } else {
            req.flash('success', 'Опис оновлено')
            res.redirect('/')
        }
    })
})
// delete home
router.delete('/:id', (req, res) => {
    if(!req.user._id) {
        res.status(500).send()
    }
    let query = {_id: req.params.id}
    Home.findById(req.params.id, (err, home) => {
        if(home.author != req.user._id) {
            res.status(500).send()
        } else {
            Home.remove(query, err => {
                if(err) {
                    console.log(err)
                }
                res.send('Success')
            })
        }
    }) 
})
// get one home
router.get('/:id', (req, res) => 
    Home.findById(req.params.id, (err, home) =>
        User.findById(home.author, (err, user) =>
            res.render('index', {home, author: user.name}))))

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