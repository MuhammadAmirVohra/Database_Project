const mongo_db = require("mongoose");
const validator = require("validator");
const pass = require("passport-local-mongoose");

// ***************** Cutomer Schema ******************** //
// ***************** Sample Data    *******************
// cid =1
// name =Daniyal HAssan
// password = 1234567 //in the range of 7 to 32
// phone = +923092021239 or 03092021239 or 03092021239
// address = any string
// CNIC =  42101-7898533-3
// creditCard = mera ha nahi to kia karon lakin check karlon ga
var CustomerSchema = mongo_db.Schema({
    // cid :{type :Number ,required : true , unique : true},
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid");
                }
            },
        },
    },
    // password: {
    //   type: String,
    //   required: true,
    //   minlength: 7,
    //   maxlenght: 32,
    //   trim: true,
    //   validate: {
    //     validator: function (value) {
    //       if (value.length < 7) {
    //         throw new Error("Password is too short ");
    //       }
    //       if (value.length > 32) {
    //         throw new Error("Password is too long");
    //       }
    //     },
    //   },
    // },
    phone: {
        type: String,
        validate: {
            validator: function(value) {
                if (!validator.isMobilePhone(value)) {
                    throw new Error("Invalid mobile phone number");
                }
            },
        },
    },
    address: {
        type: String,
        validate(value) {
            if (value.length < 3) {
                throw new Error("Invalid Address");
            }
        },
    },
    cnic: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                data = value.split("-");
                if (
                    data[0].length !== 5 ||
                    data[1].length !== 7 ||
                    data[2].length !== 1
                ) {
                    throw new Error("Invalid Identity Number");
                }
            },
        },
    },
    credit_card: {
        type: String,
        validate: {
            validator: function(value) {
                if (!validator.isCreditCard(value)) {
                    throw new Error("Invalid Credit Card Number");
                }
            },
        },
    },
});

module.exports = mongo_db.model("Customer", CustomerSchema);