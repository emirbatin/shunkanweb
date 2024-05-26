import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { Typography } from "@mui/material";

const Section5 = ({ onPlanSelect, goToNextSection, userInfo }) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [open, setOpen] = useState(false); // For popup dialog
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    onPlanSelect(plan);
    console.log(`Plan selected: ${plan}`); // Log the selected plan
  };

  const handleConfirm = async () => {
    if (!selectedPlan) {
      setOpen(true); // Plan seçilmediyse popup göster
    } else {
      // Kullanıcı bilgilerini ve seçilen planı birleştir
      const userData = { ...userInfo, plan: selectedPlan };
      console.log("User data:", userData);

      try {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || "Unknown Error");
        }

        console.log("Registration successful. User data:", json);
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        // Burada kullanıcıya hata mesajını göstermek için bir mekanizma ekleyebilirsiniz.
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    // Plan seçim ekranı
    <div className="flex flex-col justify-center items-center text-center w-auto h-screen pb-40">
      <h1>Almost done! Now choose your plan</h1>
      <br />
      <div className="flex flex-col justify-center items-center text-center w-auto h-auto">
        <div className="flex flex-row justify-center items-center text-center w-auto h-auto">
          {/* Plan kartları */}
          <div
            className="flex flex-col justify-center items-center text-center w-64 h-[400px] rounded-xl m-5 shadow-sm"
            style={{ backgroundColor: "white" }}
            onClick={() => handleSelectPlan("Free")}
          >
            <div className="flex flex-col justify-center items-center text-center w-full h-auto">
              <Typography variant="h5" className="free-plan-title">
                {t("Free")}
              </Typography>
              <br />
              <Typography variant="h5" className="free-plan-price">
                {t("N/A")}
              </Typography>
              <br />
              <ul className="text-left">
                <li style={{ color: "var(--h1-text-color)" }}>
                  {t("For large teams or office")}
                </li>
                <li style={{ color: "var(--h1-text-color)" }}>
                  {t("unlimited users")}
                </li>
                <li style={{ color: "var(--h1-text-color)" }}>
                  {t("unlimited storage")}
                </li>
              </ul>
              <br />
              <Button
                style={{ marginTop: "2rem" }}
                className="plan-button"
                variant="contained"
                type="button"
                onClick={() => handleSelectPlan("Free")} // Butona özel onClick
              >
                {t("choose")}
              </Button>
            </div>
          </div>

          <div
            className="flex flex-col justify-center items-center text-center w-64 h-[400px] rounded-xl m-5 shadow-sm"
            style={{ backgroundColor: "white" }}
            onClick={() => handleSelectPlan("Premium")}
          >
            <div className="flex flex-col justify-center items-center text-center w-full h-auto">
              <Typography variant="h5" className="premium-plan-title">
                {t("Premium")}
              </Typography>
              <br />
              <Typography variant="h5" className="premium-plan-price">
                {t("N/A")}
              </Typography>

              <br />
              <ul className="text-left">
                <li style={{ color: "var(--h1-text-color)" }}>
                  {t("For large teams or office")}
                </li>
                <li style={{ color: "var(--h1-text-color)" }}>
                  {t("unlimited users")}
                </li>
                <li style={{ color: "var(--h1-text-color)" }}>
                  {t("unlimited storage")}
                </li>
              </ul>

              <br />
              <Button
                style={{ marginTop: "2rem" }}
                className="plan-button"
                variant="contained"
                type="button"
                onClick={() => handleSelectPlan("Premium")} // Butona özel onClick
              >
                {t("choose")}
              </Button>
            </div>
          </div>
        </div>
        <Button
          style={{ marginTop: "2rem" }}
          className="confirm-button"
          variant="contained"
          type="button"
          onClick={handleConfirm} // Doğrudan handleConfirm fonksiyonunu çağır
        >
          {t("Confirm Plan")}
        </Button>
      </div>

      {/* Popup Dialog for Error */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"No Plan Selected"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select a plan to proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Section5;
