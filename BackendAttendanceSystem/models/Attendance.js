const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: String,     // important (not Date)
    required: true
  },

  checkInTime: {
    type: Date
  },

  checkOutTime: {
    type: Date
  },

  totalHours: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["present", "late", "half-day", "checked-in"],
    default: "checked-in"
  }

}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
