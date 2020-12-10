const mongo_db = require("mongoose")
const validator = require("validator")

const InvoiceSchema = new mongo_db.Schema({
    date: {
        type: Date,
        default : Date.now
    },
    amount : {
        type :Number,
        required :true,
        validator : function(value)
        {
            if(value <0 )
            {
                throw new Error("Invalid amount in invoice || amount is less than zero")
            }
        }
    },
    reason:{
        type:String
    },
    type : {
        type:String,
        required : true,
        trim : true,
        validator :function(value)
        {
            if(value.toLowerCase() !== 'credit' && value.toLowerCase() !== 'debit' )
            {
                throw new Error ("invoice type is neither credit nor debit")
            }
        }
    }
})

module.exports = mongo_db.model("Invoice",InvoiceSchema)