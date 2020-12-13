const mongo_db = require("mongoose");
const validator = require("validator");

const JobSchema = new mongo_db.Schema({
  Designation: {
    type: String,
    required: true,
    unique: true,
  },
  lower_limit: {
    type: Number,
    validate: {
      validator: function (value) {
        if (value < 0) {
          throw new Error("Lower limit is less than zero");
        }
      },
    },
  },
  uppper_limit: {
    type: Number,
    validate: {
      validator: function (value) {
        if (value < 0) {
          throw new Error("Upper limit is less than zero");
        }
      },
    },
  },
});

module.exports = mongo_db.model("Job", JobSchema);
