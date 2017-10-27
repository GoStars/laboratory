const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const filter = require('content-filter')
const MongoStore = require('connect-mongo')(session)
const config = require('./config/database')

mongoose.Promise = global.Promise
mongoose.connect(config.database, {
   useMongoClient: true 
})
// check connection
mongoose.connection.once('open', () => 
    console.log('Connected to database ' + config.database))
// check for db errors
mongoose.connection.on('error', err => console.log(err))

// init app
const app = express()

// port number
const port = process.env.PORT || 3000

// article model
let Article = require('./models/article')
// direction model
let Direction = require('./models/direction')
// researcher model
let Researcher = require('./models/researcher')
// home model
let Home = require('./models/home')
// contact model
let Contact = require('./models/contact')

// load view engine
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'pug')

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

// set public folder
app.use(express.static(path.join(__dirname, 'public')))

// content filter middleware
app.use(filter())

// express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// express messsages middleware
app.use(require('connect-flash')())
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

// express validator middleware
app.use(expressValidator({
    errorFormatter(param, msg, value) {
        const namespace = param.split('.')
        const root = namespace.shift()
        let formParam = root
        while(namespace.length) {
            formParam += `[${namespace.shift()}]`
        }
        return {param: formParam, msg, value}
    }
}))

// passport config
require('./config/passport')(passport)
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// home route
app.get('/', (req, res) =>
    Home.find({}, (err, homepage) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {homepage})
        }
    }))

// article route
app.get('/news', (req, res) =>
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('news', {title: 'Новини', articles})
        }        
    }))

// direction route
app.get('/direct', (req, res) =>
    Direction.find({}, (err, directions) => {
        if (err) {
            console.log(err)
        } else {
            res.render('direct', {title: 'Напрями науково-дослідної роботи', directions})
        }        
    }))

// researcher route
app.get('/research', (req, res) =>
    Researcher.find({}, (err, researchers) => {
        if (err) {
            console.log(err)
        } else {
            res.render('research', {title: 'Колектив дослідників', researchers})
        }        
    }))

// contacts route
app.get('/about', (req, res) =>
    Contact.find({}, (err, contacts) => {
        if (err) {
            console.log(err)
        } else {
            res.render('about', {title: 'Наші реквізити', contacts})
        }
    }))

// route files
let articles = require('./routes/articles')
let directions = require('./routes/directions')
let researchers = require('./routes/researchers')
let homepage = require('./routes/homepage')
let contacts = require('./routes/contacts')
let users = require('./routes/users')
app.use('/articles', articles)
app.use('/directions', directions)
app.use('/researchers', researchers)
app.use('/homepage', homepage)
app.use('/contacts', contacts)
app.use('/users', users)

// start server
app.listen(port, () => console.log('Server started on port ' + port))