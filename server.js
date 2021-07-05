require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const methodOverride  = require('method-override')

const User = require('./models/user')
const passport = require('passport');
require('./passport')(passport);

//routes 
const userRoute = require('./routes/user');

const PORT = process.env.PORT || 3000;

// database setup
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('-----db----')
});
 
app.set(PORT, PORT);
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', 'views');
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl:process.env.DATABASE_URL,
    }),
    cookie:{
    maxAge:24 * 60 * 60 * 1000,
    }
}))
app.use(passport.initialize());
app.use(passport.session());

const {checkIsAuthenticated, checkNotAuthenticated } = require('./middleware/auth')

app.get(['/', '/home'], checkIsAuthenticated, async(req, res) => {
    const user = await User.findOne({_id:req.session.passport.user});

    res.render('home', {username: (user.username).toUpperCase() });
})
app.get('/protected', (req, res)=>[
    res.render('protected') 
])

app.use('/user', userRoute);

app.all('*', (req, res)=>{

    const dd = req.originalUrl;
    const template = `<h1>Opps! seems like this is not a valid route</h1>
                        <h1><a href="/home">Go back to home</a></h1>`
    res.send(template);
})
 
app.listen(PORT, ()=>{
    console.log('---3030----')
})



