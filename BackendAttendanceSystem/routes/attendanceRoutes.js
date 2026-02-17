const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const managerMiddleware = require("../middleware/managerMiddleware");

const {
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
} = require("../controllers/attendanceController");

/* Employee */
router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);
router.get("/status", authMiddleware, todayStatus);
router.get("/myhistory", authMiddleware, myHistory);
router.get("/my-monthly-summary", authMiddleware, myMonthlySummary);
router.get("/my-stats", authMiddleware, myStats);

/* Manager */
router.get("/all", authMiddleware, managerMiddleware, allAttendance);
router.get("/analytics", authMiddleware, managerMiddleware, employeeAnalytics);
router.get("/filter", authMiddleware, managerMiddleware, filterByDate);
router.get("/download", authMiddleware, managerMiddleware, downloadReport);

module.exports = router;
