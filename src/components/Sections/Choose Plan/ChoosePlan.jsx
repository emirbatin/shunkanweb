import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ChoosePlan.css";
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

const Section5 = ({ goToNextSection }) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [open, setOpen] = useState(false); // For popup dialog
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectPlan = (plan) => {
    setSelectedPlan(plan);
    console.log(`Plan selected: ${plan}`); // Log the selected plan
  };

  const handleConfirm = () => {
    if (!selectedPlan) {
      setOpen(true); // Show popup if no plan is selected
    } else {
      // Proceed with the selected plan
      goToNextSection(selectedPlan); // Assuming this function is designed to handle the selected plan
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="section-choose-plan">
      <h1>Almost done! Now choose your plan</h1>
      <br />
      <div className="choose-plan-container">
        <div className="choose-plan-cards">
          <div className="plan-card" onClick={() => selectPlan("Free")}>
            <div className="plan-card-details">
              <h1 className="free-plan-title">{t("Free")}</h1>
              <br />
              <h1 className="premium-plan-price">{t("N/A")}</h1>
              <br />
              <ul className="plan-details">
                <li>{t("For large teams or office")}</li>
                <li>{t("unlimited users")}</li>
                <li>{t("unlimited storage")}</li>
              </ul>
              <br />
              <Button
                className="choose-plan-button"
                variant="contained"
                type="button"
              >
                {t("choose")}
              </Button>
            </div>
          </div>

          <div className="plan-card" onClick={() => selectPlan("Premium")}>
            <div className="plan-card-details">
              <h1 className="premium-plan-title">{t("Premium")}</h1>
              <br />
              <h1 className="premium-plan-price">{t("N/A")}</h1>
              <br />
              <ul className="plan-details">
                <li>{t("For large teams or office")}</li>
                <li>{t("unlimited users")}</li>
                <li>{t("unlimited storage")}</li>
              </ul>

              <br />
              <Button
                className="choose-plan-button"
                variant="contained"
                type="button"
              >
                {t("choose")}
              </Button>
            </div>
          </div>
        </div>
        <Button
            className="confirm-plan-button"
            variant="contained"
            type="button"
            onClick={() => {
                if (selectedPlan) {
                    //Eğer plan seçilmezse pop up uyarısı verir
                    //Seçilirse login ekranına yönlendirir
                    navigate("/login");
                }
                handleConfirm();
            }}
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
