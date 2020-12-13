
const mongo_DB = require('mongoose');
const mail = require('./utils/mail')
// const randNum = require('./utils/randomGen')
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const pass = require('passport-local-mongoose');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');
const moment = require('moment');
const Customer = require('./db/Customer.js');
const room_category = require('./db/Room_category.js');
const room = require('./db/Room.js');

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
mongo_DB.connect('mongodb+srv://amir:amir@royal.naxnw.mongodb.net/royal?retryWrites=true&w=majority' , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

mongo_DB.connection.on('connected', () => {
    console.log('Database Connected ! ');
});
mongo_DB.connection.off('error', () => {
    console.log('Database Failed to Connect');
});


room_array = [];

room_category.find({}, (err, data) => {
    var k = 0;
    console.log(data.length);

    for(var i = 0; i < data.length; i++)
    {
        if(data[i].name == "Economy")
        {
            for(var j = 1; j <= 4; j++)
            {
                k += 100;
                for(var z = k; z <= k+50; z++)
                {
                     room_array.push({
                        room_number : z,
                        category_id : data[i].id
                    })
                }
            }
        }
    
       else if(data[i].name == "Superior")
        {
            for(var j = 1; j <= 2; j++)
            {
                k += 100;
                for(var z = k; z <= k+50; z++)
                {
                    room_array.push({
                        room_number : z,
                        category_id : data[i].id
                    })
                }
            }
        }

        else if(data[i].name == "Luxury")
        {
            for(var j = 1; j <= 1; j++)
            {
                k += 100 ;
                for(var z = k; z <= k+25; z++)
                {
                    room_array.push({
                        room_number : z,
                        category_id : data[i].id
                    })
                    
                }
            }
        }
        else
        {
            console.log("err");
        }
        
    
    
    
    
    }

    // console.log(room_array); 
    
    room.insertMany(room_array,(err, data)=>
    {
        
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log("Added");
        }
        setTimeout(() => {
        
        }, 1000);
    });   
});





// var Customer_Schema = mongo_DB.Schema({
    
//     email: { type: String, required: true, unique: true, lowercase: true },
//     name: String,
//     password: { type: String, required: true},
//     address : String,
//     city:String,
//     zip_code: Number,
//     gender: String

// });


// var Customer = mongo_DB.model('Customer', Customer_Schema);

// Customer_Schema.plugin(pass);


function randNum(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
    function(username, password, done) {
      Customer.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password != password) { return done(null, false ); }
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
    res.render("index", {user : req.user });
});

app.get('/contact', (req, res) => {
    res.render("contact", {user : req.user});

});

app.get('/services', (req, res) => {
    res.render("services", {user : req.user});
});



app.get('/login', checkNotAuthenticated , (req,res) =>
{   
    verification = false;
    res.render("signin");
});

app.get("/loginfailed", checkNotAuthenticated ,function(req, res){
    if (!req.user){
      req.flash("error", "Email or Password is incorrect.");
      
      res.redirect("/login");
    }
  });


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/loginfailed' }),
  function(req, res) {
    req.flash("success", "Welcome " + req.user.name);
    
    res.redirect('/')
  });




app.get('/register', checkNotAuthenticated, (req,res)=>
{
    res.render('signup');
});

Customer_Info = {};
Code = 0;
verification = false;
Failed_Count = 0;

app.post('/register', checkNotAuthenticated, (req,res)=>
{
    Customer.findOne({ email : req.body.email} , (err, Founded)=>
    {
        if(Founded)
        {
            req.flash("error", "Email is already Registered");
            res.redirect('/login');
        }
        else
        {   
           
            Customer_Info = 
                {
                    name: req.body.fname + ' ' + req.body.lname,
                    // city: req.body.city,
                    // gender: req.body.gender,
                    // zip_code : req.body.zip,
                    address: req.body.address,
                    password: req.body.pass,
                    email: req.body.email,
                    phone : req.body.phone,
                    cnic : req.body.cnic,
                    credit_card : req.body.credit_card
                };

            Code = randNum(1000,9000);
            mail(Customer_Info.email, Code);
            verification = true;
            res.redirect("/verify");
                        
        }
        
    });


    
});

app.get('/verify', checkVerification , (req,res)=>{

    res.render('verify')
});

app.post('/verify', checkVerification, (req,res)=>
{
    if(req.body.code == Code)
    {
        Customer.create(Customer_Info, (err, Data)=>
        {
            if(err)
            {
                req.flash("error", err.message);
                console.log(err.message);
                res.redirect('/verify');
            }
            else
            {
                verification = false;
                req.flash("success", "Account Registered");
                res.redirect('/login');
            }
        });
    }
    else
    {
        Failed_Count = Failed_Count + 1;
        if(Failed_Count > 3)
        {
            Failed_Count = 0;
            Code = randNum(1000,9000);
            mail(Customer_Info.email, Code);
            req.flash("error", "New Verification Code is Sent, check Email.");
            res.redirect("/verify");

        }
        else
        {
            req.flash("error", "Wrong Verification Code");
            res.redirect("/verify");
        }
    }

});

app.get('/info', checkAuthenticated, (req,res)=>
{
    res.render("info", {user : req.user});
});


app.get('/logout', checkAuthenticated ,(req,res)=>
{
    req.logout();
    res.redirect('/');
});

app.post('/:id/delete', checkAuthenticated, (req,res)=>
{
    console.log(req.params.id);
    Customer.findByIdAndDelete(req.params.id, (err,Data)=>
    {
            req.flash("success", "Account Deleted");
            res.redirect('/logout');
    });
});

app.post('/:id/update', checkAuthenticated, (req,res)=>
{
    console.log(req.params.id);
    // Customer.findByIdAndDelete(req.params.id, (err,Data)=>
    // {
    //         req.flash("success", "Account Deleted");
    //         res.redirect('/logout');
    // });
    res.redirect("update", {user : req.user});
});



app.post("/booking", (req,res)=>
{
    // console.log(req.body.category);
    // console.log(req.body.start);
    // console.log(req.body.end);
    var start = moment(req.body.start,'M/D/YYYY');
    var end = moment(req.body.end,'M/D/YYYY');
    var diffDays = end.diff(start, 'days');
    console.log(diffDays);
    if (diffDays <= 0)
    {
        console.log("error");
        req.flash("Invalid Date");
        res.redirect("/");
    }
    else
    {
        console.log("Added");

        res.redirect('/');
    
    }
    // req.flash("error", "Email or Password is incorrect.");


    
});




var PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
{
    
    Customer_Info = {};
    Code = 0;
    verification = false;
    console.log('Server Started at ', PORT);
});


function checkVerification(req, res, next) {
    if (verification) {
        return next();
    }

    return res.redirect("/login");
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        verification = false;
        return res.redirect("/");
    }
    next();
}


