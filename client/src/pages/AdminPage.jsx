import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import {
  fetchAllCourses,
  fetchStats,
  fetchMonthlyData,
  fetchAllUserDetails,
  fetchAllQuestions,
} from "../api";
import CoursesTable from "../components/Sections/CoursesTable/CoursesTable";
import QuestionsTable from "../components/Sections/QuestionsTable/QuestionsTable";
import UsersTable from "../components/Sections/UsersTable/UsersTable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const { t } = useTranslation();
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activeSection, setActiveSection] = useState("users");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await fetchStats();
        setTotalUser(stats.totalUser);
        setTotalCourses(stats.totalCourses);
        setTotalQuestions(stats.totalQuestions);
        setNewUsers(stats.newUsers);

        const userData = await fetchAllUserDetails();
        setUsers(userData);

        const courseData = await fetchAllCourses();
        setCourses(courseData);

        const questionData = await fetchAllQuestions();
        setQuestions(questionData);

        const monthlyStats = await fetchMonthlyData();
        setMonthlyData(monthlyStats);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UsersTable users={users} />;
      case "courses":
        return <CoursesTable courses={courses} />;
      case "questions":
        return <QuestionsTable questions={questions} />;
      default:
        return <div>Select a section</div>;
    }
  };

  const getChangeColorClass = (key) => {
    if (monthlyData.length < 2) return "text-gray-500";
    const latest = monthlyData[monthlyData.length - 1][key];
    if (latest > 0) return "text-green-500";
    if (latest < 0) return "text-red-500";
    return "text-gray-500";
  };

  const getLatestChange = (key) => {
    if (monthlyData.length < 2) return "0.00%";
    const latest = monthlyData[monthlyData.length - 1][key];
    if (latest === 0) return "0.00%";
    return `${latest > 0 ? "▲" : "▼"} ${Math.abs(latest).toFixed(2)}%`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-grow px-10 overflow-auto h-screen pb-20">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4">Dashboard</Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="p-6 rounded-lg">
            <Typography variant="h5">{t("totaluser")}</Typography>
            <p className="text-3xl font-bold"> {totalUser} </p>
            <p className={getChangeColorClass("totalUsersChange")}>
              {getLatestChange("totalUsersChange")}
            </p>
          </div>
          <div className="p-6 rounded-lg">
            <Typography variant="h5">{t("totalcourses")}</Typography>
            <p className="text-3xl font-bold">{totalCourses}</p>
            <p className={getChangeColorClass("newCoursesChange")}>
              {getLatestChange("newCoursesChange")}
            </p>
          </div>
          <div className="p-6 rounded-lg">
            <Typography variant="h5">{t("totalquestions")}</Typography>
            <p className="text-3xl font-bold">{totalQuestions}</p>
            <p className={getChangeColorClass("newQuestionsChange")}>
              {getLatestChange("newQuestionsChange")}
            </p>
          </div>
          <div className="p-6 rounded-lg">
            <Typography variant="h5">{t("newusers")}</Typography>
            <p className="text-3xl font-bold">{newUsers}</p>
            <p className={getChangeColorClass("newUsersChange")}>
              {getLatestChange("newUsersChange")}
            </p>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-grow h-full w-full">
            <div className="rounded-lg mb-6 w-full">
              <Typography variant="h6" className="text-2xl font-bold">
                Visitor Statistics
              </Typography>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="newCourses"
                      stroke="#FF9789"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newQuestions"
                      stroke="#FF5A95"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="flex flex-grow h-full w-full">
            <div className="rounded-lg mb-6 w-full">
              <Typography variant="h6" className="text-2xl font-bold">
                New Users
              </Typography>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newUsers" barSize={20} fill="#FF9789" />
                    <Line type="monotone" dataKey="newUsers" stroke="#FF6666" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <div className="bg-white flex flex-col w-full h-full rounded-lg p-8">
            <div className="menu flex justify-around mb-4">
              <Button onClick={() => setActiveSection("users")}>
                <Typography variant="h6">Users</Typography>
              </Button>
              <Button onClick={() => setActiveSection("courses")}>
                <Typography variant="h6">Courses</Typography>
              </Button>
              <Button onClick={() => setActiveSection("questions")}>
                <Typography variant="h6">Questions</Typography>
              </Button>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
