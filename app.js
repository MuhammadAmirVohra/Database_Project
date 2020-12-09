const mongo_DB = require('mongoose');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const pass = require('passport-local-mongoose');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

mongo_DB.connect('mongodb+srv://amir:amir@royal.naxnw.mongodb.net/royal?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

mongo_DB.connection.on('connected', () => {
    console.log('Database Connected ! ');
})
mongo_DB.connection.off('error', () => {
    console.log('Database Failed to Connect');
})


var Customer_Schema = mongo_DB.Schema({

    email: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    password: { type: String, required: true },
    address: String,
    city: String,
    zip_code: Number,
    gender: String

});


var Customer = mongo_DB.model('Customer', Customer_Schema);

Customer_Schema.plugin(pass);


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        Customer.findOne({ email: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password != password) { return done(null, false); }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.get('/', (req, res) => {
    res.render("index");
});

app.get('/contact', (req, res) => {
    res.render("contact");

});

app.get('/services', (req, res) => {
    res.render("services");
});



app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("signin");
});

app.get("/loginfailed", checkNotAuthenticated, function(req, res) {
    if (!req.user) {
        req.flash("error", "Email or Password is incorrect.");
        res.redirect("/login");
    }
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/loginfailed' }),
    function(req, res) {
        req.flash("success", "Welcome " + req.user.name);
        res.redirect('/info')
    });




app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('signup');
});

app.post('/register', checkNotAuthenticated, (req, res) => {
    Customer.create({
            name: req.body.fname + ' ' + req.body.lname,
            city: req.body.city,
            gender: req.body.gender,
            zip_code: req.body.zip,
            address: req.body.address,
            password: req.body.pass,
            email: req.body.email
        },
        function(error, data) {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    req.flash("error", "Email is Already Registered");
                    res.redirect('/register');
                }
            } else {
                req.flash("success", "Account Registered");
                res.redirect('/login');
            }
        }

    );


});

app.get('/info', checkAuthenticated, (req, res) => {
    res.render("info", { user: req.user });
});


app.get('/logout', checkAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.post('/:id/delete', checkAuthenticated, (req, res) => {
    console.log(req.params.id);
    Customer.findByIdAndDelete(req.params.id, (err, Data) => {
        req.flash("success", "Account Deleted");
        res.redirect('/logout');
    });
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});





function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}