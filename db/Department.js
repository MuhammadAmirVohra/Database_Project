const mongo_db = require("mongoose")
const validator = require("validator")
const staff = require('./Staff');


const DepartmentSchema = new mongo_db.Schema({
    dname: {
        type: String,
        unique: true,
        required: true
    },
    mng_ssn: [{
        type: mongo_db.Types.ObjectId,
        ref: 'Staff'
    }]
})

module.exports = mongo_db.model("Department", DepartmentSchema)