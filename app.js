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
const dialogflow = require("@google-cloud/dialogflow")
const dotenv = require("dotenv");
const socketio = require("socket.io");
const uuid = require("uuid");
const http = require('http');
const { default: validator } = require("validator");

var PORT = process.env.PORT || 5000;

dotenv.config({ path: __dirname + "/config/config.env" })
const server = http.createServer(app);
server.listen(PORT, () => {
    Customer_Info = {};
    Code = 0;
    user = null;
    verification = false;
    console.log("socket io")
    console.log("Server Started at ", PORT);
});

const io = socketio(server);

io.on("connection", function(socket) {
    console.log("a user connected");

    socket.on("chat message", (message) => {
        console.log(message);
        //process.env.PROJECT_ID
        const callapibot = async(projectId = "royalbot-oivy") => {
            try {
                const sessionId = uuid.v4();
                const sessionClient = new dialogflow.SessionsClient({
                    keyFilename: __dirname + "/royalbot-oivy-4e1507925fe1.json",
                });
                console.log("working")
                const sessionPath = sessionClient.projectAgentSessionPath(
                    projectId,
                    sessionId
                );
                const request = {
                    session: sessionPath,
                    queryInput: {
                        text: {
                            text: message,
                            languageCode: "en-US",
                        },
                    },
                };
                // Error is here 
                const responses = await sessionClient.detectIntent(request);

                console.log("Detected intent");
                const result = responses[0].queryResult.fulfillmentText;
                //const x = responses[0].queryResult.fulfillmentMessages[2].linkOutSuggestion
                //console.log(x)
                console.log("complete result :: ", result)
                gur = "bot reply"
                if (validator.isURL(result)) {
                    gur = "bot url reply";
                } else {
                    gur = "bot reply"
                }
                socket.emit(gur, result);
                console.log(result);
                if (result.intent) {
                    console.log(`  Intent: ${result.intent.displayName}`);
                } else {
                    console.log(`  No intent matched.`);
                }
            } catch (error) {
                console.log(error);
            }
        };

        callapibot();
    });
})










invoice.watch().on('change', (change) => {
    console.log(change);

});

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
        useCreateIndex: true,
        useFindAndModify: false
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
//             name: "Syed Daniyal Hassan",
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

app.get("/bot", (req, res) => {
    res.render("bot")
})


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
        console.log(req.user.email);
        const break_email = req.user.email.split("@")
        if (break_email[1] === "royal-hotel.com") {
            if (break_email[0] == "frontdesk") {
                user = req.user;
                res.redirect('/frontdesk');
            } else {
                staff.findOne({ email: req.user.email }, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        user = data;
                        req.flash("success", "Welcome " + user.name);
                        job.findOne({ Designation: "CEO" }, (err, job_data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (user.job_id == job_data.id) {
                                    res.redirect('/ceo');
                                } else {
                                    res.redirect('/manager');
                                }
                            }
                        });

                    }
                });

            }
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
                        Customer.deleteOne({ _id: Data.id }, (err, deleted) => { if (!err) { console.log("Deleted") } });
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
    Customer.findOne({ _id: req.params.id }, (err, customer_data) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect('/');
        } else {
            account.findOneAndDelete({ email: customer_data.email }, (err, delete_account) => {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect('/');
                } else {
                    Customer.findByIdAndDelete(req.params.id, (err, Data) => {
                        req.flash("success", "Account Deleted");
                        res.redirect("/logout");
                    });
                }

            });
        }
    });



});

app.get("/:id/update", checkAuthenticated, (req, res) => {

    Customer.findOne({ _id: req.params.id }, (err, user_data) => {
        if (err) {
            console.log(err);
        } else {
            account.findOne({ email: user_data.email }, (err, account_data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(user_data);
                    console.log(account_data);
                    res.render("update", {
                        user: user_data,
                        account: account_data
                    });
                }
            });
        }



    });

});


app.post("/:id/update", checkAuthenticated, (req, res) => {

    Customer.findOne({ _id: req.params.id }, (err, old_data) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/" + req.params.id + "/update");
        } else {
            Customer.findOneAndUpdate({ _id: req.params.id }, {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                cnic: req.body.cnic,
                credit_card: req.body.credit_card


            }, (err, user_data) => {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/" + req.params.id + "/update");
                } else {
                    account.findOneAndUpdate({ email: old_data.email }, {
                        email: req.body.email,
                        password: req.body.pass

                    }, (err, account_data) => {
                        if (err) {
                            console.log(err);
                            req.flash("error", err.message);
                            res.redirect("/" + req.params.id + "/update");
                        } else {

                            res.redirect('/');
                        }
                    });
                }



            });
        }
    });





});


/*
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
                req.flash("error", err.message);
                res.redirect("/");
            } else {
                console.log(category_data._id);
                room.find({
                    category_id: category_data.id
                }, (err, categorized_room) => {
                    if (err) {
                        console.log(err);
                        req.flash("error", err.message);
                        res.redirect("/");
                    } else {
                        console.log("Room Recieved of ID :" + categorized_room[0].id);
                        reservation.find({}, (err, all_reservation) => {
                            if (err) {
                                console.log(err);
                                req.flash("error", err.message);
                                res.redirect("/");
                            } else {
                                // console.log("Reservation Data Recieved");
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

                                // console.log("One time " + desired_room);

                                department.findOne({
                                        dname: "Room Booking"
                                    },
                                    (err, room_book_department) => {
                                        if (err) {
                                            console.log(err);
                                            req.flash("error", err.message);
                                            res.redirect("/");
                                            //   break;
                                        } else {
                                            // console.log("Room Booking Department ID : " + room_book_department.id);
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
                                                        req.flash("error", err.message);
                                                        res.redirect("/");
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
                                                                req.flash("error", err.message);
                                                                res.redirect("/");
                                                                // break;
                                                            } else {
                                                                // console.log("Added");
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
*/



room_info = {};


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
                req.flash("error", err.message);
                res.redirect("/");
            } else {
                console.log(category_data._id);
                room.find({
                    category_id: category_data.id
                }, (err, categorized_room) => {
                    if (err) {
                        console.log(err);
                        req.flash("error", err.message);
                        res.redirect("/");
                    } else {
                        console.log("Room Recieved of ID :" + categorized_room[0].id);
                        reservation.find({}, (err, all_reservation) => {
                            if (err) {
                                console.log(err);
                                req.flash("error", err.message);
                                res.redirect("/");
                            } else {
                                // console.log("Reservation Data Recieved");
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

                                // console.log("One time " + desired_room);

                                if (desired_room) {

                                    room_info = {
                                        diffDays: diffDays,
                                        category_data: category_data,
                                        desired_room: desired_room,
                                        start: moment(start).format('LL'),
                                        end: moment(end).format('LL')
                                    }
                                    console.log(room_info);
                                    res.render('room_info', { room_info: room_info });


                                } else {
                                    req.flash("error", "Hotel is Full ! All rooms are booked !");
                                    res.redirect('/');
                                }

                            }
                        });
                    }
                });
            }
        });


    }
});



app.post('/booked', checkAuthenticated, (req, res) => {


    department.findOne({
            dname: "Room Booking"
        },
        (err, room_book_department) => {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("/");
                //   break;
            } else {
                // console.log("Room Booking Department ID : " + room_book_department.id);
                invoice.create({
                        date: moment(Date.now()),
                        amount: parseInt(room_info.category_data.price) * room_info.diffDays,
                        reason: "User with ID : " +
                            user.id +
                            " have booked room No." +
                            room_info.desired_room.room_number,
                        type: "credit",
                        department_id: room_book_department.id,
                    },
                    (err, invoice_data) => {
                        if (err) {
                            console.log(err);
                            req.flash("error", err.message);
                            res.redirect("/");
                            //   break;
                        } else {
                            reservation.create({
                                room_id: room_info.desired_room.id,
                                customer_id: user.id,
                                start: room_info.start,
                                end: room_info.end,
                                invoice_id: invoice_data.id,
                            }, (err, reservation_done) => {
                                if (err) {
                                    console.log(err);
                                    req.flash("error", err.message);
                                    res.redirect("/");
                                    // break;
                                } else {
                                    // console.log("Added");
                                    // flag_break = true
                                    req.flash("success", "Room is booked for " + room_info.diffDays + " Days");
                                    res.redirect("/");
                                }

                            });
                        }
                    }
                );
            }
        }
    );

});






app.get('/ceo', checkCEO, (req, res) => {
    staff.find({ manager_id: user.id })
        .populate('department_id')
        .exec(async function(err, results) {
            invoice.find({}).populate('department_id').exec(function(err, invoices) {
                if (err) { console.log(err); } else {
                    staff.find({ department_id: { $exists: true } }).populate('department_id').exec(function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {

                            invoice.find({}, { amount: 1, type: 1, _id: 0, date: 1 }).sort('-date').exec((err, invoice_data) => {



                                if (err) {
                                    console.log(err);
                                } else {


                                    credit = {}
                                    debit = {}
                                        // console.log(data[0].date.format('MM/DD/YYYY'))
                                    invoice_data.forEach((record) => {

                                        var c = 0;
                                        var d = 0;
                                        if (record.type == "credit") {
                                            if (!credit[moment(record.date).format('LL')])
                                                credit[moment(record.date).format('LL')] = 0;

                                            credit[moment(record.date).format('LL')] += record.amount;
                                        } else {
                                            if (!debit[moment(record.date).format('LL')])
                                                debit[moment(record.date).format('LL')] = 0;

                                            debit[moment(record.date).format('LL')] += record.amount;
                                        }

                                    });

                                    // var dates = Object.keys(credit).concat(Object.keys(debit))
                                    var dates = [...new Set([...Object.keys(credit), ...Object.keys(debit)])]
                                    Object.keys(credit).forEach((record) => { if (!debit[record]) debit[record] = 0; });
                                    Object.keys(debit).forEach((record) => { if (!credit[record]) credit[record] = 0; });

                                    console.log(dates);
                                    console.log(credit);
                                    console.log(debit);

                                    res.render("ceo", {
                                        managers: results,
                                        ceo: user,
                                        invoices: invoices,
                                        staff_count: [Object.keys(data).filter((record) => data[record].department_id.dname == "Maintenance").length || 0,
                                            Object.keys(data).filter((record) => data[record].department_id.dname == "Finance").length,
                                            Object.keys(data).filter((record) => data[record].department_id.dname == "General").length
                                        ],
                                        credit: credit,
                                        debit: debit,
                                        dates: dates.sort()
                                    });
                                }





                            });






                        }
                    });
                }
            });
        });

});



app.post('/addmanager', checkCEO, (req, res) => {
    department.findOne({ dname: req.body.department }, (err, department_data) => {
        if (err) {
            console.log(err);
        } else {
            job.findOne({ Designation: "Manager" }, (err, job_data) => {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/ceo");
                } else {

                    staff.create({
                        name: req.body.fname + " " + req.body.lname,
                        salary: req.body.salary,
                        job_id: job_data.id,
                        email: req.body.email,
                        department_id: department_data.id,
                        manager_id: user.id

                    }, (err, staff_data) => {
                        if (err) {
                            console.log(err);
                            req.flash("error", err.message);
                            res.redirect("/ceo");
                        } else {
                            console.log("Staff Data Inserted");
                            account.create({
                                email: req.body.email,
                                password: req.body.pass
                            }, (err, account_data) => {
                                if (err) {
                                    console.log(err);
                                    staff.deleteOne({ _id: staff_data.id });
                                } else {
                                    console.log("Account Data Created");
                                    department.updateOne({ dname: req.body.department }, { $push: { mng_ssn: staff_data.id } }, (err, updated) => {
                                        if (err) {
                                            console.log(err);

                                            account.deleteOne({ _id: account_data.id });
                                            staff.deleteOne({ _id: staff_data.id });
                                            req.flash("error", err.message);
                                            res.redirect("/ceo");
                                        } else {
                                            console.log("DONE !!");
                                            req.flash("success", "Manager Data Added !");
                                            res.redirect("/ceo");
                                        }
                                    });


                                }
                            })
                        }
                    });
                }
            });
        }
    });




});


app.post('/delete_manager', (req, res) => {
    department.updateOne({ mng_ssn: req.body.id }, { $pull: { mng_ssn: [req.body.id] } }, (err, deleted) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect('/ceo');
        } else {
            account.deleteOne({ email: req.body.email }, (err, acc_delete) => {
                if (err) {
                    console.log(err);
                } else {
                    staff.deleteMany({ manager_id: req.body.id }, (err, deleted) => {
                        if (err) {
                            console.log(err);
                        } else {
                            staff.deleteOne({ email: req.body.email }, (err, staff_delete) => {

                                if (err) {
                                    console.log(err);
                                } else {

                                    console.log("Deleted");
                                    req.flash("success", "Data Deleted");
                                    res.redirect('/ceo');
                                }
                            });
                        }
                    })
                }
            });
        }
    });

});




app.get('/manager', CheckManager, (req, res) => {

    department.findOne({ mng_ssn: user.id }, (err, department_data) => {
        if (err) { console.log(err); } else {

            staff.find({ manager_id: user.id }, (err, staff_data) => {
                if (err) {
                    console.log(err);
                } else {
                    if (department_data.dname == "Finance") {
                        invoice.find({}).populate('department_id').exec(function(err, invoices) {
                            if (err) {
                                console.log(err);
                            } else {

                                res.render("manager", { manager: user, department: department_data.dname, staff: staff_data, invoices: invoices });
                            }
                        });
                    } else {
                        invoice.find({ department_id: department_data.id }, (err, invoices) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render("manager", { manager: user, department: department_data.dname, staff: staff_data, invoices: invoices });
                            }
                        });
                    }


                }
            });
        }
    });


});


app.post('/add_staff', CheckManager, (req, res) => {

    department.findOne({ mng_ssn: user.id }, (err, department_data) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect('/manager');
        } else {

            var des = "";
            if (department_data.dname == "Finance")
                des = "Technical";
            else
                des = "Non Technical";

            job.findOne({ Designation: des }, (err, job_data) => {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect('/manager');

                } else {

                    staff.create({
                        name: req.body.fname + " " + req.body.lname,
                        salary: req.body.salary,
                        email: req.body.email,
                        manager_id: user.id,
                        job_id: job_data.id,
                        department_id: user.department_id
                    }, (err, staf_data) => {
                        if (err) {
                            console.log(err);
                            req.flash("error", err.message);
                            res.redirect('/manager');
                        } else {
                            req.flash("success", "Staff Data Added");
                            res.redirect('/manager');
                        }
                    });
                }
            });
        }
    });


});

app.post('/remove_staff', CheckManager, (req, res) => {
    staff.findOne({ _id: req.body.id }, (err, data) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect('/manager');
        } else {
            if (data) {
                console.log(data);
                console.log(req.body.id);
                console.log(req.body.email);
                if (data.id == req.body.id && data.email == req.body.email) {

                    staff.deleteOne({ _id: req.body.id }, (err, delete_data) => {
                        if (err) {
                            console.log(err);
                            req.flash("error", err.message);
                            res.redirect('/manager');
                        } else {
                            if (delete_data) {
                                req.flash("success", "Staff Data Deleted");
                                res.redirect('/manager');
                            } else {
                                req.flash("erorr", "Data Not Found");
                                res.redirect('/manager');
                            }
                        }
                    });

                } else {
                    req.flash("error", "Please Provide Correct Data to Delete the Record");
                    res.redirect('/manager');
                }
            }
        }
    })
});



app.post('/add_invoice', CheckManager, (req, res) => {

    invoice.create({
            date: moment(Date.now()),
            amount: req.body.amount,
            reason: req.body.reason,
            type: "debit",
            department_id: user.department_id,
        },
        (err, invoice_data) => {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect('/manager');
            } else {
                req.flash("success", "Invoice Added !");
                res.redirect('/manager');
            }
        });


});



app.get('/frontdesk', CheckFrontDesk, (req, res) => {
    reservation.find({}).populate('room_id').populate('customer_id').exec(function(err, reservations) {
        if (err) { console.log(err); } else {
            Customer.find({}, (err, Customer_Data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('frontdesk', { Reservations: reservations, Customers: Customer_Data });
                }
            });
        }

    });
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

function checkCEO(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.email.split("@")[1] == "royal-hotel.com") {
            job.findOne({ Designation: "CEO" }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    if (data.id == user.job_id) {
                        next();
                    } else {
                        res.redirect('/manager');
                    }
                }
            });
        } else {
            res.redirect('/');
        }

    } else {
        res.redirect('/login');
    }

}


function CheckFrontDesk(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.email.split("@")[1] == "royal-hotel.com") {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
    }
}


function CheckManager(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.email.split("@")[1] == "royal-hotel.com" && req.user.email.split("@")[0] != "frontdesk") {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
    }
}


// invoice.aggregate([{
//     $group: {
//         _id: { "date": date.toDateString(), "type": "$type" },
//         count: { $sum: "$amount" }
//     }
// }], (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });