const Attendance = require("../models/Attendance");
const { Parser } = require("json2csv");

/* ================= IST TIME ================= */

const getISTNow = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

const getTodayDate = () => {
  return getISTNow().toISOString().split("T")[0];
};

/* ================= CHECK IN ================= */

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();
    const now = getISTNow();

    const existing = await Attendance.findOne({ userId, date: today });
    if (existing)
      return res.status(400).json({ message: "You already checked in today" });

    let status = "present";
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (hour > 11 || (hour === 11 && minute > 0))
      status = "half-day";
    else if (hour > 9 || (hour === 9 && minute > 30))
      status = "late";

    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime: now,
      status,
    });

    res.json({ message: "Check-in successful", attendance });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CHECK OUT ================= */

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();
    const now = getISTNow();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance)
      return res.status(400).json({ message: "You didn't check in today" });

    if (attendance.checkOutTime)
      return res.status(400).json({ message: "Already checked out" });

    attendance.checkOutTime = now;

    const diff = (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);
    attendance.totalHours = parseFloat(diff.toFixed(2));

    if (attendance.totalHours < 4)
      attendance.status = "half-day";

    await attendance.save();

    res.json({ message: "Check-out successful", attendance });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= TODAY STATUS ================= */

const todayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) return res.json({ status: "not-checked-in" });
    if (attendance.checkOutTime) return res.json({ status: "completed" });

    res.json({ status: "checked-in" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= HISTORY ================= */

const myHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(records);
  } catch {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

/* ================= MONTHLY SUMMARY ================= */

const myMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = getISTNow();

    const month = now.getMonth();
    const year = now.getFullYear();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const records = await Attendance.find({
      userId,
      date: { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] }
    });

    let present = 0, late = 0, half = 0, hours = 0;

    records.forEach(r => {
      if (r.status === "present") present++;
      else if (r.status === "late") late++;
      else half++;

      hours += r.totalHours || 0;
    });

    res.json({
      presentDays: present,
      lateDays: late,
      halfDays: half,
      totalHours: hours.toFixed(2)
    });

  } catch {
    res.status(500).json({ message: "Failed to fetch monthly summary" });
  }
};

/* ================= STATS ================= */

const myStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Attendance.find({ userId });

    let present = 0, late = 0, half = 0;

    records.forEach(r => {
      if (r.status === "present") present++;
      else if (r.status === "late") late++;
      else half++;
    });

    res.json({ present, late, half });

  } catch {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/* ================= MANAGER ================= */

const allAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("userId", "name employeeId email department")
      .sort({ date: -1 });

    res.json(records);
  } catch {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

const employeeAnalytics = async (req, res) => {
  try {
    const records = await Attendance.find().populate("userId", "_id");

    let regular = 0, irregular = 0, lowProductive = 0;
    const map = {};

    records.forEach(r => {
      const id = r.userId._id;
      if (!map[id]) map[id] = { present: 0, late: 0, half: 0 };

      if (r.status === "present") map[id].present++;
      else if (r.status === "late") map[id].late++;
      else map[id].half++;
    });

    Object.values(map).forEach(emp => {
      if (emp.present >= emp.late && emp.present >= emp.half) regular++;
      else if (emp.late > emp.present) irregular++;
      else lowProductive++;
    });

    res.json({ regular, irregular, lowProductive });

  } catch {
    res.status(500).json({ message: "Analytics failed" });
  }
};

/* ================= FILTER ================= */

const filterByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const records = await Attendance.find({ date })
      .populate("userId", "name employeeId department");
    res.json(records);
  } catch {
    res.status(500).json({ message: "Filter failed" });
  }
};

/* ================= DOWNLOAD CSV (FINAL CORRECT FIX) ================= */

const downloadReport = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("userId", "name employeeId");

    // ---- DATE FORMAT (DD/MM/YYYY) ----
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const d = new Date(dateString);
      return d.toLocaleDateString("en-GB");   // 17/02/2026
    };

    // ---- TIME FORMAT (12hr IST) ----
    const formatTime = (time) => {
      if (!time) return "";
      const t = new Date(time);
      return t.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    };

    // ---- BUILD CSV DATA ----
    const data = records.map(r => ({
      Name: r.userId?.name || "N/A",
      EmployeeID: r.userId?.employeeId || "N/A",

      // ⭐ THIS LINE FIXES ######## EXCEL ISSUE
      Date: `'${formatDate(r.date)}`,  

      CheckIn: formatTime(r.checkInTime),
      CheckOut: formatTime(r.checkOutTime),
      Hours: r.totalHours ? r.totalHours.toFixed(2) : "0.00",
      Status: r.status || "-"
    }));

    const parser = new Parser({
      fields: ["Name","EmployeeID","Date","CheckIn","CheckOut","Hours","Status"]
    });

    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=Payroll_Report.csv");
    res.status(200).send(csv);

  } catch (err) {
    console.log("CSV ERROR:", err);
    res.status(500).json({ message: "CSV download failed" });
  }
};


module.exports = {
  checkIn,
  checkOut,
  todayStatus,
  myHistory,
  myMonthlySummary,
  myStats,
  allAttendance,
  employeeAnalytics,
  filterByDate,
  downloadReport
};
