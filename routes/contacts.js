const express = require('express')

const router = express.Router()

// contact model
let Contact = require('../models/contact')
// user model
let User = require('../models/user')

// add route
router.get('/add', ensureAuthenticated, (req, res) => 
    res.render('add_contact', {title: 'Додати контакти'}))
// add submit post route
router.post('/add', (req, res) => {
    // req.checkBody('title', 'Назва обов\'язкова').notEmpty()
    // req.checkBody('author', 'Author is required').notEmpty()
    req.checkBody('body', 'Тіло обов\'язкове').notEmpty()
    // get errors
    let errors = req.validationErrors()
    if (errors) {
        res.render('add_contact', {title: 'Додати контакти', errors})
    } else {
        let contact = new Contact()
        contact.author = req.user._id
        contact.body = req.body.body  
        contact.save(err => {
            if (err) {
                console.log(err)
                return
            } else {
                req.flash('success', 'Контакти додано')
                res.redirect('/about')
            }
        })
    }
})
// load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => 
    Contact.findById(req.params.id, (err, contact) => {
        if (contact.author != req.user._id) {
            req.flash('danger', 'Не авторизований')
            res.redirect('/about')
        }
        res.render('edit_contact', {title: 'Редагувати контакти', contact})
    }))
// Update submit post route
router.post('/edit/:id', (req, res) => {
    let contact = {}
    contact.author = req.body.author
    contact.body = req.body.body  
    let query = {_id: req.params.id}
    Contact.update(query, contact, err => {
        if (err) {
            console.log(err)
            return
        } else {
            req.flash('success', 'Контакти оновлено')
            res.redirect('/about')
        }
    })
})
// delete contact
router.delete('/:id', (req, res) => {
    if(!req.user._id) {
        res.status(500).send()
    }
    let query = {_id: req.params.id}
    Contact.findById(req.params.id, (err, contact) => {
        if(contact.author != req.user._id) {
            res.status(500).send()
        } else {
            Contact.remove(query, err => {
                if(err) {
                    console.log(err)
                }
                res.send('Success')
            })
        }
    }) 
})
// get one contact
router.get('/:id', (req, res) => 
    Contact.findById(req.params.id, (err, contact) =>
        User.findById(contact.author, (err, user) =>
            res.render('about', {contact, author: user.name}))))

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