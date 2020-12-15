const mongo_DB = require("mongoose");
const mail = require("./utils/mail");
// const randNum = require('./utils/randomGen')
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const pass = require("passport-local-mongoose");
const bodyParser = require("body-parser");
const app = express();
const flash = require("connect-flash");
const moment = require("moment");
const Customer = require("./db/Customer.js");
const room_category = require("./db/Room_category.js");
const room = require("./db/Room.js");
const reservation = require("./db/Reservation");
const invoice = require("./db/Invoice");
const department = require("./db/Department");
const account = require('./db/Account');
const staff = require('./db/Staff');
const job = require('./db/Job');



app.use(
    require("express-session")({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);

app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static(__dirname + "/public"));
mongo_DB.connect(
    "mongodb+srv://amir:amir@royal.naxnw.mongodb.net/royal?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);

mongo_DB.connection.on("connected", () => {
    console.log("Database Connected ! ");
});
mongo_DB.connection.off("error", () => {
    console.log("Database Failed to Connect");
});

// job.findOne({ Designation: "CEO" }, (err, job_data) => {
//     if (err) {
//         console.log(err);
//     } else {

//         staff.create({
//             staff_name: "Syed Daniyal Hassan",
//             salary: 1000000,
//             job_id: job_data.id,
//             email: "daniyal@royal-hotel.com"

//         }, (err, staff_data) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("CEO Data Added");
//                 account.create({
//                     email: "daniyal@royal-hotel.com",
//                     password: "daniyal"
//                 }, (err, account_data) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log("Account Created");
//                     }
//                 })
//             }
//         });
//     }
// });



// reservation.find({}, (err, all_reservation)=>{

//     // console.log(all_reservation);

//     for(var i = 0; i < all_reservation.length; i++)
//     {
//         if((moment('2020-10-12').isBetween(all_reservation[i].start, all_reservation[i].end) || moment(all_reservation[i].end).isBetween('2020-10-12', '2020-10-16')))
//         {
//             console.log(all_reservation[i]);
//         }

//     }
// });

// reservation.create({
//     start : moment('10/2/2020', 'M/D/YYYY').add(1,'days')
// },(err, data)=>{
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("Added");
//     }
// });

// room_array = [];

// room_category.find({}, (err, data) => {
//     var k = 0;
//     console.log(data.length);

//     for(var i = 0; i < data.length; i++)
//     {
//         if(data[i].name == "Economy")
//         {
//             for(var j = 1; j <= 4; j++)
//             {
//                 k += 100;
//                 for(var z = k; z <= k+50; z++)
//                 {
//                      room_array.push({
//                         room_number : z,
//                         category_id : data[i].id
//                     })
//                 }
//             }
//         }

//        else if(data[i].name == "Superior")
//         {
//             for(var j = 1; j <= 2; j++)
//             {
//                 k += 100;
//                 for(var z = k; z <= k+50; z++)
//                 {
//                     room_array.push({
//                         room_number : z,
//                         category_id : data[i].id
//                     })
//                 }
//             }
//         }

//         else if(data[i].name == "Luxury")
//         {
//             for(var j = 1; j <= 1; j++)
//             {
//                 k += 100 ;
//                 for(var z = k; z <= k+25; z++)
//                 {
//                     room_array.push({
//                         room_number : z,
//                         category_id : data[i].id
//                     })

//                 }
//             }
//         }
//         else
//         {
//             console.log("err");
//         }

//     }

//     // console.log(room_array);
//     room.init()
//     room.insertMany(room_array,(err)=>
//     {

//         if (err)
//         {
//             console.log(err);
//         }
//         else
//         {
//             console.log("Added");
//         }

//     });

// });

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
    return Math.floor(Math.random() * (max - min)) + min;
}

var user = null;

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(function(username, password, done) {
        account.findOne({
            email: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
            }
            return done(null, user);
        });
    })
);

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

app.get("/", (req, res) => {
    // console.log(user);
    res.render("index", {
        user: user
    });
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        user: user
    });
});

app.get("/services", (req, res) => {
    res.render("services", {
        user: user
    });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
    verification = false;
    res.render("signin");
});

app.get("/loginfailed", checkNotAuthenticated, function(req, res) {
    if (!req.user) {
        req.flash("error", "Email or Password is incorrect.");

        res.redirect("/login");
    }
});


app.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/loginfailed"
    }),
    function(req, res) {
        const break_email = req.user.email.split("@")
        if (break_email[1] === "royal-hotel.com") {
            staff.findOne({ email: req.user.email }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    user = data;
                    console.log(user);
                    req.flash("success", "Welcome " + user.name);
                    res.redirect("/")
                }
            });

        } else {
            Customer.findOne({ email: req.user.email }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    user = data;
                    req.flash("success", "Welcome " + user.name);
                    res.redirect("/")
                }
            });
        }

    }
);

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("signup");
});

Customer_Info = {};
Code = 0;
verification = false;
Failed_Count = 0;

app.post("/register", checkNotAuthenticated, (req, res) => {
    Customer.findOne({
        email: req.body.email
    }, (err, Founded) => {
        if (Founded) {
            req.flash("error", "Email is already Registered");
            res.redirect("/login");
        } else {
            Customer_Info = {
                name: req.body.fname + " " + req.body.lname,
                address: req.body.address,
                // password: req.body.pass,
                email: req.body.email,
                phone: req.body.phone,
                cnic: req.body.cnic,
                credit_card: req.body.credit_card,
            };

            Customer_Account = {
                password: req.body.pass,
                email: req.body.email

            };

            Code = randNum(1000, 9000);
            mail(Customer_Info.email, Code);
            verification = true;
            res.redirect("/verify");
        }
    });
});

app.get("/verify", checkVerification, (req, res) => {
    res.render("verify");
});

app.post("/verify", checkVerification, (req, res) => {
    if (req.body.code == Code) {
        Customer.create(Customer_Info, (err, Data) => {
            if (err) {
                req.flash("error", err.message);
                console.log(err);
                res.redirect("/register");
            } else {
                account.create(Customer_Account, (err, Account_Data) => {
                    if (err) {
                        req.flash("error", err.message);
                        console.log(err);
                        Customer.deleteOne({ id: Data.id }, (err, deleted) => { if (!err) { console.log("Deleted") } });
                        res.redirect("/register");
                    } else {
                        verification = false;
                        req.flash("success", "Account Registered");
                        res.redirect("/login");
                    }
                });
            }
        });
    } else {
        Failed_Count = Failed_Count + 1;
        if (Failed_Count > 3) {
            Failed_Count = 0;
            Code = randNum(1000, 9000);
            mail(Customer_Info.email, Code);
            req.flash("error", "New Verification Code is Sent, check Email.");
            res.redirect("/verify");
        } else {
            req.flash("error", "Wrong Verification Code");
            res.redirect("/verify");
        }
    }
});

app.get("/info", checkAuthenticated, (req, res) => {
    res.render("info", {
        user: user
    });
});

app.get("/logout", checkAuthenticated, (req, res) => {
    req.logout();
    user = null;
    res.redirect("/");
});

app.post("/:id/delete", checkAuthenticated, (req, res) => {
    console.log(req.params.id);
    Customer.findByIdAndDelete(req.params.id, (err, Data) => {
        req.flash("success", "Account Deleted");
        res.redirect("/logout");
    });
});

app.post("/:id/update", checkAuthenticated, (req, res) => {
    console.log(req.params.id);
    // Customer.findByIdAndDelete(req.params.id, (err,Data)=>
    // {
    //         req.flash("success", "Account Deleted");
    //         res.redirect('/logout');
    // });
    res.redirect("update", {
        user: user
    });
});

app.post("/booking", checkAuthenticated, (req, res) => {

    var start = moment(req.body.start, "M/D/YYYY").add(1, "days");
    var end = moment(req.body.end, "M/D/YYYY").add(1, "days");
    var diffDays = end.diff(start, "days");

    console.log(diffDays);

    if (diffDays <= 0) {

        console.log("error");
        req.flash("error", "Invalid Date");
        res.redirect("/");

    } else {
        room_category.findOne({
            name: req.body.category
        }, (err, category_data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(category_data._id);
                room.find({
                    category_id: category_data.id
                }, (err, categorized_room) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Room Recieved of ID :" + categorized_room[0].id);
                        reservation.find({}, (err, all_reservation) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Reservation Data Recieved");
                                reserved = [];
                                for (var i = 0; i < all_reservation.length; i++) {
                                    if (
                                        moment(start).isBetween(
                                            all_reservation[i].start,
                                            all_reservation[i].end
                                        ) ||
                                        moment(all_reservation[i].end).isBetween(start, end)
                                    ) {
                                        reserved.push(all_reservation[i]);
                                    }
                                }
                                var desired_room;
                                for (i = 0; i < categorized_room.length; i++) {
                                    flag = true;
                                    flag_break = false;
                                    for (var j = 0; j < reserved.length; j++) {
                                        if (categorized_room[i].id == reserved[j].room_id) {
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        desired_room = categorized_room[i];
                                        break;
                                    }

                                }

                                console.log("One time " + desired_room);

                                department.findOne({
                                        dname: "Room Booking"
                                    },
                                    (err, room_book_department) => {
                                        if (err) {
                                            console.log(err);

                                            //   break;
                                        } else {
                                            console.log("Room Booking Department ID : " + room_book_department.id);
                                            invoice.create({
                                                    date: moment(Date.now()),
                                                    amount: parseInt(category_data.price) * diffDays,
                                                    reason: "User with ID : " +
                                                        user.id +
                                                        " have booked room No." +
                                                        desired_room.room_number,
                                                    type: "credit",
                                                    department_id: room_book_department.id,
                                                },
                                                (err, invoice_data) => {
                                                    if (err) {
                                                        console.log(err);
                                                        //   break;
                                                    } else {
                                                        reservation.create({
                                                            room_id: desired_room.id,
                                                            customer_id: user.id,
                                                            start: start,
                                                            end: end,
                                                            invoice_id: invoice_data.id,
                                                        }, (err, reservation_done) => {
                                                            if (err) {
                                                                console.log(err);
                                                                // break;
                                                            } else {
                                                                console.log("Added");
                                                                // flag_break = true
                                                                req.flash("success", "Room is booked for " + diffDays + " Days");
                                                                res.redirect("/");
                                                            }

                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );


                            }
                        });
                    }
                });
            }
        });


    }
});

var PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    Customer_Info = {};
    Code = 0;
    user = null;
    verification = false;
    console.log("Server Started at ", PORT);
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
    req.flash("You have to login first");
    return res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        verification = false;
        return res.redirect("/");
    }
    next();
}