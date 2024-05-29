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
} from "@mui/material";
import { createQuestion } from "../api";

const AddNewQuestionPage = () => {
  const [questionData, setQuestionData] = useState({
    questionText: "",
    options: [{ label: "", description: "" }],
    correctAnswer: "",
    points: 1,
    difficulty: "easy",
    mediaType: "none",
    media: null,
  });

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
      console.log("Question created successfully:", response);
    } catch (error) {
      console.error("Question creation failed:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h1" gutterBottom>
        Add New Question
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
                label="Question Text"
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
                        label={`Option ${index + 1} Label`}
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
                        label={`Option ${index + 1} Description`}
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
                  Add Option
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correct Answer"
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
                label="Points"
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
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  name="difficulty"
                  value={questionData.difficulty}
                  onChange={handleInputChange}
                  input={
                    <OutlinedInput
                      label="Difficulty"
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
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="mediaType-label">Media Type</InputLabel>
                <Select
                  labelId="mediaType-label"
                  name="mediaType"
                  value={questionData.mediaType}
                  onChange={handleInputChange}
                  input={
                    <OutlinedInput
                      label="Media Type"
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
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
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
                Add Question
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default AddNewQuestionPage;
