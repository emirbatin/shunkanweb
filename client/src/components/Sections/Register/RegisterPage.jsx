import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import Google from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import "./RegisterPage.css";

const Sections3 = ({ goToNextSection }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(username, password);
  };

  return (
    <div className="register-section">
      <div className="register-container">
        <h1 className="register-title">
          {t(
            "Nice to meet you! {userName}, We just need a few more steps to create your account."
          )}
        </h1>
        <div className="form-container">
          <div class="form-left">
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-container">
                <p className="input-label">{t("username")}</p>
                <input
                  className="input-field"
                  type="text"
                  placeholder={t("username")}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="input-container">
                <p className="input-label">{t("email")}</p>
                <input
                  className="input-field"
                  type="email"
                  placeholder={t("email")}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="input-container">
                <p className="input-label">{t("password")}</p>
                <input
                  className="input-field"
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={handlePasswordChange}
                />

                {/*Button  */}
                <Button
                  className="next-section-button"
                  variant="contained"
                  type="button"
                  onClick={goToNextSection}
                >
                  {t("continue")}
                </Button>
              </div>

              <div className="agreement-container">
                {/*Checkbox */}
                <div className="agreement-checkbox-container">
                  <input
                    id="agreement"
                    className="agreement-checkbox"
                    type="checkbox"
                  ></input>
                  <div className="agreement-label-container">
                    <label htmlFor="agreement" className="agreement-label">
                      {t("I agree to the terms and conditions")}
                    </label>
                    <div className="terms-privacy-container">
                      <a className="terms-label">Terms & Conditions</a>
                      <a className="privacy-label">Privacy Policy</a>
                    </div>
                  </div>
                </div>

                <br />
              </div>
            </form>
          </div>
          <div className="form-middle">
            <div className="form-or-container">
              <hr className="form-line" />
              <p className="form-or-text">{t("or")}</p>
              <hr className="form-line" />
            </div>
          </div>

          <div class="form-right">
            <div className="social-register-container">
              <Button
                className="apple-register-button"
                variant="contained"
                startIcon={<AppleIcon />}
                type="button"
              >
                {t("signinwithapple")}
              </Button>

              <Button
                className="facebook-register-button"
                variant="contained"
                startIcon={<FacebookIcon />}
                type="button"
              >
                {t("signinwithfacebook")}
              </Button>

              <Button
                className="google-register-button"
                variant="contained"
                startIcon={<Google />}
                type="button"
              >
                {t("signinwithgoogle")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections3;
