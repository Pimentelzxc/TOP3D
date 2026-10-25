import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/manrope";
import App from "./App";
import "./styles/index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
