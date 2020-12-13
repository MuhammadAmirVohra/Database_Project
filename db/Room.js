const mongo_db = require("mongoose");
const validator = require("validator");
const room_category = require("./Room_category")
const pass = require("passport-local-mongoose");
// const { model } = require("./Customer")

// const Category_schema = new mongo_db.Schema({
//     name : {
//         type:String,
//         trim:true,
//         required:true,
//         validator:function(value){
//             if(!value)
//             {
//                 throw new Error ("Invalid Name Type Of Category")
//             }
//         }
//     },
//     price :{
//         type:Number,
//         required:true,
//         validator:function(value)
//         {
//             if(value<0)
//             {
//                 throw new Error("Invalid price of room")
//             }

//         }
//     }

// })
// module.exports = mongo_db.model('room_category',Category_schema)

const RoomSchema = new mongo_db.Schema({
    room_number: {
        type: Number,
        unique: true,
        required: true,
        validate: {
            validator: function(value) {
                if (value === NaN) {
                    throw new Error("ROOM Id is NULL ");
                }
                if (value < 0) {
                    throw new Error("Invalid Room Id");
                }
            },
        },
    },
    category_id: {
        type: mongo_db.Types.ObjectId,
        ref: "room_category",
    },
});

module.exports = mongo_db.model("Room", RoomSchema);