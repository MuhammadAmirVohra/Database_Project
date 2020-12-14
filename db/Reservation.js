const mongo_db = require("mongoose")
const validator = require("validator")
const moment = require('moment');
const Customer = require('./Customer.js')
const Room = require("./Room")
const invoice = require('./Invoice');

const ReservationSchema = new mongo_db.Schema({
    //one reservation may have multiple rooms
    room_id: {
        type: mongo_db.Types.ObjectId,
        ref: 'Room'
    },
    customer_id: {
        type: mongo_db.Types.ObjectId,
        ref: 'Customer'
    },
    start: {
        type: Date,
        default: moment(Date.now())
    },
    end: {
        type: Date
    },
    invoice_id: {
        type: mongo_db.Types.ObjectId,
        ref: 'Invoice'
    }

})

module.exports = mongo_db.model("Reservation", ReservationSchema)