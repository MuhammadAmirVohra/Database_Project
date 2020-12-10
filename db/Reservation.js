const mongo_db = require("mongoose")
const validator = require("validator")
const Customer = require('./Customer.js')
const Room = require("./Room")

const ReservationSchema = new mongo_db.Schema({
    //one reservation may have multiple rooms
    roomid : [{
        type:mongo_db.Types.ObjectId ,ref :'Room'
    }],
    customerid :{
        type : mongo_db.Types.ObjectId ,
        ref : 'Customer'
    },
    start :
    {
        type :Date,
        default: Date.now
    },
    end:
    {
        type :Date
    },
    invoiceid :{
        type : mongo_db.Types.ObjectId,
        ref : 'Invoice'
    }

})

module.exports = mongo_db.model("Reservation", ReservationSchema)