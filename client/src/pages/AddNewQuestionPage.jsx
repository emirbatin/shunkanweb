import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import { createQuestion } from "../api";
import { useTranslation } from "react-i18next";

const AddNewQuestionPage = () => {
  const { t } = useTranslation();
  const [questionData, setQuestionData] = useState({
    questionText: "",
    options: [{ label: "", description: "" }],
    correctAnswer: "",
    points: 1,
    difficulty: "easy",
    mediaType: "none",
    media: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleAddOption = () => {
    setQuestionData({
      ...questionData,
      options: [...questionData.options, { label: "", description: "" }],
    });
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...questionData.options];
    newOptions[index][event.target.name] = event.target.value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    setQuestionData({ ...questionData, media: file });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(questionData).forEach(([key, value]) => {
      if (key === "options") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await createQuestion(formData);
      console.log(t("Question created successfully:"), response);
      setSnackbarMessage(t("Question created successfully!"));
      setSnackbarOpen(true);
    } catch (error) {
      console.error(t("Question creation failed:"), error);
      setSnackbarMessage(t("Question creation failed!"));
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h1" gutterBottom>
        {t("Add New Question")}
      </Typography>
      <div
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("Question Text")}
                variant="outlined"
                name="questionText"
                value={questionData.questionText}
                onChange={handleInputChange}
                required
                InputProps={{
                  style: {
                    backgroundColor: "var(--input-area-bg-color)",
                    color: "var(--text-color)",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                {questionData.options.map((option, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label={`${t("Option")} ${index + 1} ${t("Label")}`}
                        variant="outlined"
                        name="label"
                        value={option.label}
                        onChange={(e) => handleOptionChange(index, e)}
                        required
                        InputProps={{
                          style: {
                            backgroundColor: "var(--input-area-bg-color)",
                            color: "var(--text-color)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label={`${t("Option")} ${index + 1} ${t(
                          "Description"
                        )}`}
                        variant="outlined"
                        name="description"
                        value={option.description}
                        onChange={(e) => handleOptionChange(index, e)}
                        required
                        InputProps={{
                          style: {
                            backgroundColor: "var(--input-area-bg-color)",
                            color: "var(--text-color)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
                <Button onClick={handleAddOption} style={{ marginTop: "10px" }}>
                  {t("Add Option")}
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("Correct Answer")}
                variant="outlined"
                name="correctAnswer"
                value={questionData.correctAnswer}
                onChange={handleInputChange}
                required
                InputProps={{
                  style: {
                    backgroundColor: "var(--input-area-bg-color)",
                    color: "var(--text-color)",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("Points")}
                type="number"
                variant="outlined"
                name="points"
                value={questionData.points}
                onChange={handleInputChange}
                required
                InputProps={{
                  style: {
                    backgroundColor: "var(--input-area-bg-color)",
                    color: "var(--text-color)",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="difficulty-label">{t("Difficulty")}</InputLabel>
                <Select
                  labelId="difficulty-label"
                  name="difficulty"
                  value={questionData.difficulty}
                  onChange={handleInputChange}
                  input={
                    <OutlinedInput
                      label={t("Difficulty")}
                      style={{
                        backgroundColor: "var(--input-area-bg-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  }
                  required
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "var(--input-area-bg-color)",
                      },
                    },
                  }}
                >
                  <MenuItem value="easy">{t("Easy")}</MenuItem>
                  <MenuItem value="medium">{t("Medium")}</MenuItem>
                  <MenuItem value="hard">{t("Hard")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="mediaType-label">{t("Media Type")}</InputLabel>
                <Select
                  labelId="mediaType-label"
                  name="mediaType"
                  value={questionData.mediaType}
                  onChange={handleInputChange}
                  input={
                    <OutlinedInput
                      label={t("Media Type")}
                      style={{
                        backgroundColor: "var(--input-area-bg-color)",
                        color: "var(--text-color)",
                      }}
                    />
                  }
                  required
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "var(--input-area-bg-color)",
                        color: "var(--text-color)",
                      },
                    },
                  }}
                >
                  <MenuItem value="none">{t("None")}</MenuItem>
                  <MenuItem value="image">{t("Image")}</MenuItem>
                  <MenuItem value="video">{t("Video")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {questionData.mediaType !== "none" && (
              <Grid item xs={12}>
                <input
                  accept={`${questionData.mediaType}/*`}
                  type="file"
                  onChange={handleMediaChange}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {t("Add Question")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            snackbarMessage.includes(t("successfully")) ? "success" : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddNewQuestionPage;
