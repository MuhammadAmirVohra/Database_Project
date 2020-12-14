const mongo_db = require("mongoose");
const validator = require("validator");
const moment = require('moment');
const department = require('./Department');

const InvoiceSchema = new mongo_db.Schema({
    date: {
        type: Date,
        default: moment(Date.now()),
    },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                if (value < 0) {
                    throw new Error(
                        "Invalid amount in invoice || amount is less than zero"
                    );
                }
            },
        },
    },
    reason: {
        type: String,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                if (
                    value.toLowerCase() !== "credit" &&
                    value.toLowerCase() !== "debit"
                ) {
                    throw new Error("invoice type is neither credit nor debit");
                }
            },
        },
    },
    department_id: {
        type: mongo_db.Types.ObjectId,
        ref: "Department",
    },
});

module.exports = mongo_db.model("Invoice", InvoiceSchema);