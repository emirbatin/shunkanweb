const express = require("express");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Question = require("../models/questionModel");

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalQuestions = await Question.countDocuments();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.json({ totalUser, totalCourses, totalQuestions, newUsers });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).send('Server error');
  }
});

router.get('/monthly-data', async (req, res) => {
  try {
    const now = new Date();
    const pastSixMonths = [...Array(6)].map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      return { month: date.toLocaleString('default', { month: 'short' }), date };
    }).reverse();

    let monthlyData = await Promise.all(pastSixMonths.map(async ({ month, date }) => {
      const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      const totalUsers = await User.countDocuments({
        createdAt: { $lt: nextMonthDate }
      });
      const newUsers = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextMonthDate }
      });
      const newCourses = await Course.countDocuments({
        createdAt: { $gte: date, $lt: nextMonthDate }
      });
      const newQuestions = await Question.countDocuments({
        createdAt: { $gte: date, $lt: nextMonthDate }
      });

      return {
        month,
        totalUsers,
        newUsers,
        newCourses,
        newQuestions
      };
    }));

    // Calculate the percentage change for each metric
    monthlyData = monthlyData.map((data, index) => {
      if (index === 0) {
        return {
          ...data,
          totalUsersChange: 0,
          newUsersChange: 0,
          newCoursesChange: 0,
          newQuestionsChange: 0
        };
      }
      const prevMonthData = monthlyData[index - 1];
      const totalUsersChange = prevMonthData.totalUsers ? ((data.totalUsers - prevMonthData.totalUsers) / prevMonthData.totalUsers) * 100 : 0;
      const newUsersChange = prevMonthData.newUsers ? ((data.newUsers - prevMonthData.newUsers) / prevMonthData.newUsers) * 100 : 0;
      const newCoursesChange = prevMonthData.newCourses ? ((data.newCourses - prevMonthData.newCourses) / prevMonthData.newCourses) * 100 : 0;
      const newQuestionsChange = prevMonthData.newQuestions ? ((data.newQuestions - prevMonthData.newQuestions) / prevMonthData.newQuestions) * 100 : 0;

      return {
        ...data,
        totalUsersChange,
        newUsersChange,
        newCoursesChange,
        newQuestionsChange
      };
    });

    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
