import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import Google from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Typography } from "@mui/material";

const Sections3 = ({ onCreateAccount, goToNextSection }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termandCondition, setTermandCondition] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    onCreateAccount("username", event.target.value);
    console.log("username: ", event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    onCreateAccount("email", event.target.value);
    console.log("email: ", event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    onCreateAccount("password", event.target.value);
    console.log("password: ", event.target.value);
  };

  const handleTermandConditionChange = (event) => {
    setTermandCondition(event.target.checked);
    onCreateAccount("termandCondition", event.target.checked);
    console.log("termandCondition: ", event.target.checked);
  };

  return (
    <div className="register-section">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Typography
          className="mt-8 mb-4 flex flex-row justify-start"
          variant="h6"
        >
          {t(
            "Nice to meet you!, We just need a few more steps to create your account."
          )}
        </Typography>
        {/* Left Form */}
        <div className="flex flex-row w-full h-full">
          <div class="flex flex-grow flex-col justify-end items-end w-auto h-full">
            <form className="register-form" style={{ marginTop: "5em" }}>
              {/* Input Container */}
              <div className="flex flex-col items-start text-left justify-between w-full mb-4">
                <Typography
                  variant="body2"
                  style={{ marginBottom: 5, marginTop: 5 }}
                >
                  {t("username")}
                </Typography>
                <input
                  class="p-4 w-7/5 border border-gray-300 rounded-md bg-input-area-bg-color text-text-color focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                  style={{
                    color: "var(--text-color)",
                    backgroundColor: "var(--input-area-bg-color)",
                  }}
                  type="text"
                  placeholder={t("username")}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="flex flex-col items-start text-left justify-between w-full mb-4">
                <Typography
                  variant="body2"
                  style={{ marginBottom: 5, marginTop: 5 }}
                >
                  {t("email")}
                </Typography>
                <input
                  class="p-4 w-7/5 border border-gray-300 rounded-md bg-input-area-bg-color text-text-color focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                  style={{
                    color: "var(--text-color)",
                    backgroundColor: "var(--input-area-bg-color)",
                  }}
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              <div className="flex flex-col items-start justify-between w-full mb-4">
                <Typography
                  variant="body2"
                  style={{ marginBottom: 5, marginTop: 5 }}
                >
                  {t("password")}
                </Typography>
                <input
                  class="p-4 w-7/5 border border-gray-300 rounded-md bg-input-area-bg-color text-text-color focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                  style={{
                    color: "var(--text-color)",
                    backgroundColor: "var(--input-area-bg-color)",
                  }}
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={handlePasswordChange}
                />

                {/*Button  */}
                <Button
                  className="next-section-button"
                  style={{ marginTop: 50 }}
                  variant="contained"
                  type="button"
                  onClick={goToNextSection}
                >
                  {t("continue")}
                </Button>
              </div>

              {/* Agreement Container */}
              <div className="flex flex-col justify-start items-start">
                {/*Checkbox Container*/}
                <div className="flex flex-row justify-center items-center">
                  <input
                    id="agreement"
                    className="agreement-checkbox"
                    type="checkbox"
                    value={termandCondition}
                    onChange={handleTermandConditionChange}
                  ></input>
                  {/*Checkbox Label Container*/}
                  <div className="flex flex-col justify-start items-start ml-4">
                    <label htmlFor="agreement" className="agreement-label">
                      {t("I agree to the terms and conditions")}
                    </label>
                    {/*Terms and Privacy Container*/}
                    <div className="flex flex-row justify-start items-start">
                      {/* Terms Label */}
                      <a
                        className="cursor-pointer mr-8"
                        style={{ color: "var(--button-color)" }}
                      >
                        Terms & Conditions
                      </a>

                      {/* Privacy Label */}
                      <a
                        className="cursor-pointer mr-8"
                        style={{ color: "var(--button-color)" }}
                      >
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                </div>

                <br />
              </div>
            </form>
          </div>

          {/* Middle Form */}
          <div
            className="flex flex-grow flex-col justify-center items-center"
            style={{ marginTop: "2rem" }}
          >
            {/* Form Or Container */}
            <div className="grid-cols-3">
              <hr
                className="w-1 h-40 border-none rounded-md m-8"
                style={{ backgroundColor: "var(--button-color)" }}
              />
              <Typography variant="h5" style={{ color: "var(--button-color)" }}>
                {t("or")}
              </Typography>
              <hr
                className="w-1 h-40 border-none rounded-md m-8"
                style={{ backgroundColor: "var(--button-color)" }}
              />
            </div>
          </div>

          {/* Right Form */}
          <div
            class="flex flex-grow flex-col justify-start items-start w-auto h-full"
            style={{ marginTop: "8.5rem" }}
          >
            <div className="flex flex-col justify-center items-center">
              {/* Apple Login Buttons */}
              <Button
                className="w-52 rounded-md cursor-pointer apple-button"
                style={{ marginBottom: 40 }}
                variant="contained"
                startIcon={<AppleIcon className="appleIcon" />}
                type="button"
              >
                {t("signinwithapple")}
              </Button>

              {/* Facebook Login Buttons */}
              <Button
                className="w-52 rounded-md cursor-pointer facebook-button"
                style={{ marginBottom: 40 }}
                variant="contained"
                startIcon={<FacebookIcon className="facebookIcon" />}
                type="button"
              >
                {t("signinwithfacebook")}
              </Button>

              {/* Google Login Buttons */}
              <Button
                className="w-52 rounded-md cursor-pointer google-button"
                style={{ marginBottom: 40 }}
                variant="contained"
                startIcon={<Google className="googleIcon" />}
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
