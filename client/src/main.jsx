import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js";
import { CourseContextProvider } from './context/CourseContext.jsx'
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <React.Suspense fallback="loading...">
    <CourseContextProvider>
      <App />
    </CourseContextProvider>
      
    </React.Suspense>
  </React.StrictMode>
);
