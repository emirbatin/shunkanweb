require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const questionRoutes = require("./routes/questions");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use('/uploads', express.static('uploads'));
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use('/api/questions', questionRoutes);

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

process.env;
