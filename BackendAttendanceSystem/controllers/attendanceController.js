const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { Parser } = require("json2csv");

/* ========================= HELPERS ========================= */
function getToday() {
  return new Date().toISOString().split("T")[0];
}
function hookingUser(req) {
  return req.user._id;
}

/* ========================= CHECK IN ========================= */
exports.checkIn = async (req, res) => {
  try {
    const userId = hookingUser(req);
    const today = getToday();

    const existing = await Attendance.findOne({ userId, date: today });
    if (existing)
      return res.status(400).json({ message: "Already checked in today" });

    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime: new Date(),
      status: "checked-in"
    });

    res.json({ message: "Check-in successful", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= CHECK OUT ========================= */
exports.checkOut = async (req, res) => {
  try {
    const userId = hookingUser(req);
    const today = getToday();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance)
      return res.status(400).json({ message: "You must check-in first" });

    if (attendance.checkOutTime)
      return res.status(400).json({ message: "Already checked out today" });

    attendance.checkOutTime = new Date();

    const diff = attendance.checkOutTime - attendance.checkInTime;
    const hours = diff / (1000 * 60 * 60);
    attendance.totalHours = Number(hours.toFixed(2));

    if (hours >= 8) attendance.status = "present";
    else if (hours >= 4) attendance.status = "half-day";
    else attendance.status = "late";

    await attendance.save();

    res.json({ message: "Check-out successful", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= TODAY STATUS ========================= */
exports.todayStatus = async (req, res) => {
  try {
    const userId = hookingUser(req);
    const today = getToday();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) return res.json({ status: "not-checked-in" });
    if (attendance.checkOutTime) return res.json({ status: "completed", attendance });

    return res.json({ status: "checked-in", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= EMPLOYEE HISTORY ========================= */
exports.myHistory = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= MONTHLY SUMMARY (FIXED FOR REACT) ========================= */
exports.monthlyReport = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id });

    let presentDays = 0;
    let lateDays = 0;
    let halfDays = 0;
    let totalHours = 0;

    records.forEach(r => {
      if (r.status === "present") presentDays++;
      if (r.status === "late") lateDays++;
      if (r.status === "half-day") halfDays++;
      totalHours += r.totalHours || 0;
    });

    res.json({
      presentDays,
      lateDays,
      halfDays,
      totalHours: Number(totalHours.toFixed(2))
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= ATTENDANCE STATS (LAST 7 DAYS) ========================= */
exports.attendanceStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const records = await Attendance.find({
      userId: req.user._id,
      checkInTime: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= ALL EMPLOYEES (MANAGER) ========================= */
exports.allAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= FILTER BY DATE ========================= */
exports.filterByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const records = await Attendance.find({ date })
      .populate("userId", "name employeeId department");

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= MANAGER DASHBOARD ANALYTICS ========================= */
exports.employeeAnalytics = async (req, res) => {
  try {
    const today = getToday();

    const records = await Attendance.find({ date: today });

    let regularEmployees = 0;
    let irregularEmployees = 0;
    let lowProductivity = 0;

    records.forEach(r => {
      if (r.status === "present") regularEmployees++;
      else if (r.status === "late") irregularEmployees++;
      else if ((r.totalHours || 0) < 4) lowProductivity++;
    });

    res.json({
      regularEmployees,
      irregularEmployees,
      lowProductivity
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= CSV REPORT DOWNLOAD (FIXED) ========================= */
exports.downloadReport = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("userId", "name employeeId");

    const reportData = records.map(r => ({
      Name: r.userId?.name || "",
      EmployeeID: r.userId?.employeeId || "",
      Date: r.date,
      CheckIn: r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "",
      CheckOut: r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "",
      Status: r.status,
      TotalHours: r.totalHours || 0
    }));

    const parser = new Parser({
      fields: ["Name","EmployeeID","Date","CheckIn","CheckOut","Status","TotalHours"]
    });

    const csv = parser.parse(reportData);

    res.setHeader("Content-Disposition", "attachment; filename=attendance-report.csv");
    res.setHeader("Content-Type", "text/csv");

    return res.status(200).send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "CSV generation failed" });
  }
};
