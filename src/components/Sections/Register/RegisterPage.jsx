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
    <div className="sectionRegisterPage">
      <div className="registerPageContainer">
        <h1 className="registerPageTitle">
          {t(
            "Nice to meet you! {userName}, We just need a few more steps to create your account."
          )}
        </h1>
        <div className="registerPageDivContainer">
          <form className="registerPageForm" onSubmit={handleSubmit}>
            <div class="registerPageLeftContainer">
              <div className="registerPageUsernameInputContainer">
                <p className="registerPageUsernameText">{t("username")}</p>
                <input
                  className="registerPageUsernameInput"
                  type="text"
                  placeholder={t("username")}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="registerPageUsernameInputContainer">
                <p className="registerPageUsernameText">{t("Email")}</p>
                <input
                  className="registerPageUsernameInput"
                  type="email"
                  placeholder={t("Email")}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="registerPagePasswordInputContainer">
                <p className="registerPagePasswordText">{t("password")}</p>
                <input
                  className="registerPagePasswordInput"
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {/*Checkbox */}
              <input className="userAgreement" type="checkbox"></input>
              <label htmlFor="userAgreement" className="userAgreementLabel">
                {t("I agree to the terms and conditions")}
              </label>
              <br />
              <a className="TermsAndConditions">TermsAndConditions</a>

              {/*Button  */}
              <button className="registerButton" type="submit">
                {t("register")}
              </button>
            </div>
          </form>
          <div className="registerPageORContainer">
            <hr className="registerPageLine" />
            <p className="registerPageOR">{t("or")}</p>
            <hr className="registerPageLine" />
          </div>

          <div class="registerPageRightContainer">
            <div className="orregisterContainer">
              <Button
                className="registerPageAppleRegisterButton"
                variant="contained"
                startIcon={<AppleIcon />}
                type="button"
              >
                {t("signinwithapple")}
              </Button>

              <Button
                className="registerPageFacebookRegisterButton"
                variant="contained"
                startIcon={<FacebookIcon />}
                type="button"
              >
                {t("signinwithfacebook")}
              </Button>

              <Button
                className="registerPageGoogleRegisterButton"
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
