const mongo_db = require("mongoose");
const validator = require("validator");
const pass = require("passport-local-mongoose");
// const { model } = require("./Customer")

const Category_schema = new mongo_db.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function (value) {
        if (!value) {
          throw new Error("Invalid Name Type Of Category");
        }
      },
    },
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        if (value < 0) {
          throw new Error("Invalid price of room");
        }
      },
    },
  },
});
module.exports = mongo_db.model("room_category", Category_schema);
