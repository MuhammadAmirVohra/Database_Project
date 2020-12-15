const mongo_db = require("mongoose");
const validator = require("validator");
const pass = require("passport-local-mongoose");

const AccountSchema = new mongo_db.Schema({
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
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlenght: 32,
        trim: true,
        validate: {
            validator: function(value) {
                if (value.length < 7) {
                    throw new Error("Password is too short ");
                }
                if (value.length > 32) {
                    throw new Error("Password is too long");
                }
            },
        },
    },
});

module.exports = mongo_db.model("Account", AccountSchema);