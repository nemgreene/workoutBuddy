const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const DaySchema = new Scheme({
  day: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    required: true,
  },
  focus: {
    type: String,
    required: true,
  },
  exercises: {
    type: Array,
    required: true,
  },
});

module.exports = Day = mongoose.model("Day", DaySchema);
