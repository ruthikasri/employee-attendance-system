const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");  
const attendanceController = require("../controllers/attendanceController");

/* ---------- EMPLOYEE ---------- */

router.post("/checkin", protect, attendanceController.checkIn);
router.post("/checkout", protect, attendanceController.checkOut);
router.get("/today", protect, attendanceController.todayStatus);
router.get("/myhistory", protect, attendanceController.myHistory);
router.get("/stats", protect, attendanceController.attendanceStats);
router.get("/summary", protect, attendanceController.monthlyReport);


/* ---------- MANAGER ---------- */

router.get("/all", protect, authorizeRole("manager"), attendanceController.allAttendance);
router.get("/monthly-report", protect, authorizeRole("manager"), attendanceController.monthlyReport);
router.get("/analytics", protect, authorizeRole("manager"), attendanceController.employeeAnalytics);
router.get("/download", protect, authorizeRole("manager"), attendanceController.downloadReport);
router.get("/filter", protect, authorizeRole("manager"), attendanceController.filterByDate);
router.get("/report", protect, authorizeRole("manager"), attendanceController.downloadReport);

module.exports = router;
