const mongo_db = require("mongoose")
const validator = require("validator")

const StaffSchema = new mongo_db.Schema({
    staff_name : {
        type : String,
        required :true,
        trim : true
    },
    salary :{
        type:Number , 
        required : true,
        validate(v)
        {
            if(v<0)
            {
                throw new Error("invalid staff's salary")
            }
        }
    },
    manager_id :{
        type :mongo_db.Types.ObjectId,
        ref:'Staff'
    },
    job_id :{
        type : mongo_db.Types.ObjectId,
        ref : 'Job'
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    department_id:{
        type : mongo_db.Types.ObjectId, ref : 'Department'
    }
})



module.exports = mongo_db.model("Staff",StaffSchema)