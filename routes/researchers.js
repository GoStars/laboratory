const express = require('express')

const router = express.Router()

// researcher model
let Researcher = require('../models/researcher')
// user model
let User = require('../models/user')

// add route
router.get('/add', ensureAuthenticated, (req, res) => 
    res.render('add_researcher', {title: 'Додати дослідника'}))
// add submit post route
router.post('/add', (req, res) => {
    req.checkBody('title', 'Назва обов\'язкова').notEmpty()
    // req.checkBody('author', 'Author is required').notEmpty()
    req.checkBody('body', 'Тіло обов\'язкове').notEmpty()
    // get errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('add_researcher', {title: 'Додати дослідника', errors})
    } else {
        let researcher = new Researcher()
        researcher.title = req.body.title
        researcher.author = req.user._id
        researcher.body = req.body.body  
        researcher.save(err => {
            if (err) {
                console.log(err)
                return
            } else {
                req.flash('success', 'Дослідника додано')
                res.redirect('/research')
            }
        })
    }
})
// load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => 
    Researcher.findById(req.params.id, (err, researcher) => {
        if (researcher.author != req.user._id) {
            req.flash('danger', 'Не авторизований')
            res.redirect('/research')
        }
        res.render('edit_researcher', {title: 'Редагувати дослідника', researcher})
    }))
// Update submit post route
router.post('/edit/:id', (req, res) => {
    let researcher = {}
    researcher.title = req.body.title
    researcher.author = req.body.author
    researcher.body = req.body.body  
    let query = {_id: req.params.id}
    Researcher.update(query, researcher, err => {
        if (err) {
            console.log(err)
            return
        } else {
            req.flash('success', 'Дослідника оновлено')
            res.redirect('/research')
        }
    })
})
// delete researcher
router.delete('/:id', (req, res) => {
    if(!req.user._id) {
        res.status(500).send()
    }
    let query = {_id: req.params.id}
    Researcher.findById(req.params.id, (err, researcher) => {
        if(researcher.author != req.user._id) {
            res.status(500).send()
        } else {
            Researcher.remove(query, err => {
                if(err) {
                    console.log(err)
                }
                res.send('Success')
            })
        }
    }) 
})
// get one researcher
router.get('/:id', (req, res) => 
    Researcher.findById(req.params.id, (err, researcher) =>
        User.findById(researcher.author, (err, user) =>
            res.render('researcher', {researcher, author: user.name}))))

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