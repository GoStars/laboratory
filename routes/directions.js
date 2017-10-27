const express = require('express')

const router = express.Router()

// direction model
let Direction = require('../models/direction')
// user model
let User = require('../models/user')

// add route
router.get('/add', ensureAuthenticated, (req, res) => 
    res.render('add_direction', {title: 'Додати напрям'}))
// add submit post route
router.post('/add', (req, res) => {
    req.checkBody('title', 'Назва обов\'язкова').notEmpty()
    // req.checkBody('author', 'Author is required').notEmpty()
    req.checkBody('body', 'Тіло обов\'язкове').notEmpty()
    // get errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('add_direction', {title: 'Додати напрям', errors})
    } else {
        let direction = new Direction()
        direction.title = req.body.title
        direction.author = req.user._id
        direction.body = req.body.body  
        direction.save(err => {
            if (err) {
                console.log(err)
                return
            } else {
                req.flash('success', 'Напрям додано')
                res.redirect('/direct')
            }
        })
    }
})
// load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => 
    Direction.findById(req.params.id, (err, direction) => {
        if (direction.author != req.user._id) {
            req.flash('danger', 'Не авторизований')
            res.redirect('/direct')
        }
        res.render('edit_direction', {title: 'Редагувати напрям', direction})
    }))
// Update submit post route
router.post('/edit/:id', (req, res) => {
    let direction = {}
    direction.title = req.body.title
    direction.author = req.body.author
    direction.body = req.body.body  
    let query = {_id: req.params.id}
    Direction.update(query, direction, err => {
        if (err) {
            console.log(err)
            return
        } else {
            req.flash('success', 'Напрям оновлено')
            res.redirect('/direct')
        }
    })
})
// delete direction
router.delete('/:id', (req, res) => {
    if(!req.user._id) {
        res.status(500).send()
    }
    let query = {_id: req.params.id}
    Direction.findById(req.params.id, (err, direction) => {
        if(direction.author != req.user._id) {
            res.status(500).send()
        } else {
            Direction.remove(query, err => {
                if(err) {
                    console.log(err)
                }
                res.send('Success')
            })
        }
    }) 
})
// get one direction
router.get('/:id', (req, res) => 
    Direction.findById(req.params.id, (err, direction) =>
        User.findById(direction.author, (err, user) =>
            res.render('direction', {direction, author: user.name}))))

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