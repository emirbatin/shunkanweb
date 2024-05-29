import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAllQuestions, createCourse } from "../api";
import { useTranslation } from "react-i18next";

const AddNewCoursePage = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [skill, setSkill] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await fetchAllQuestions();
        setAllQuestions(data);
      } catch (error) {
        console.error(t("Failed to fetch questions:"), error);
      }
    };

    fetchQuestions();
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setThumbnail(URL.createObjectURL(file));
    setThumbnailFile(file);
  };

  const handleSkillChange = (event) => {
    setSkill(event.target.value);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSelectQuestion = (question) => {
    setQuestions([...questions, question]);
    handleCloseDialog();
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const questionIds = questions.map((q) => q._id);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("minimumSkill", skill);
    formData.append("questions", JSON.stringify(questionIds));
    if (thumbnailFile) {
      formData.append("image", thumbnailFile);
    }

    try {
      const response = await createCourse(formData);
      console.log(t("Course created successfully:"), response);
      setSnackbarMessage(t("Course created successfully!"));
      setSnackbarOpen(true);
    } catch (error) {
      console.error(t("Course creation failed:"), error);
      setSnackbarMessage(t("Course creation failed!"));
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getMediaUrl = (question) => {
    return question.mediaUrl || "https://via.placeholder.com/150";
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h1" gutterBottom>
        {t("Add New Course")}
      </Typography>
      <br />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <div className="text-center">
              <input
                accept="image/*"
                type="file"
                id="thumbnail-upload"
                className="hidden"
                onChange={handleThumbnailChange}
                name="image"
              />
              <label htmlFor="thumbnail-upload">
                <img
                  src={thumbnail || "https://via.placeholder.com/150"}
                  alt={t("Course Thumbnail")}
                  className="w-48 h-48 cursor-pointer border border-gray-300 rounded-lg"
                />
              </label>
            </div>
            <div className="flex justify-start mt-5">
              <Button type="submit" variant="contained" color="primary">
                {t("Add Course")}
              </Button>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("Course Title")}
                  variant="outlined"
                  value={title}
                  onChange={handleTitleChange}
                  required
                  InputProps={{
                    style: { backgroundColor: "var(--input-area-bg-color)" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("Course Description")}
                  variant="outlined"
                  value={description}
                  onChange={handleDescriptionChange}
                  required
                  InputProps={{
                    style: { backgroundColor: "var(--input-area-bg-color)" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="skill-label">{t("Minimum Skill")}</InputLabel>
                  <Select
                    labelId="skill-label"
                    value={skill}
                    onChange={handleSkillChange}
                    label={t("Minimum Skill")}
                    required
                    input={
                      <OutlinedInput
                        label={t("Minimum Skill")}
                        style={{ backgroundColor: "var(--input-area-bg-color)" }}
                      />
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: "var(--input-area-bg-color)",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>{t("None")}</em>
                    </MenuItem>
                    <MenuItem value="beginner">{t("Beginner")}</MenuItem>
                    <MenuItem value="intermediate">{t("Intermediate")}</MenuItem>
                    <MenuItem value="advanced">{t("Advanced")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div className="max-h-[30em] overflow-auto">
                  {questions.map((question, index) => (
                    <Card key={index} className="mb-2">
                      <CardContent>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                          className="h-full"
                        >
                          <Grid item xs={2}>
                            <img
                              src={getMediaUrl(question)}
                              alt={t("Media")}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{question.questionText}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              color="secondary"
                              onClick={() => handleRemoveQuestion(index)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  <Card
                    className="mb-2"
                    style={{ backgroundColor: "transparent", boxShadow: "none" }}
                  >
                    <CardContent>
                      <Button
                        variant="outlined"
                        onClick={handleOpenDialog}
                        className="flex w-full h-full m-0 p-0 justify-center items-center"
                      >
                        <span className="text-xl">+</span> {t("Add Question")}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{t("Select a Question")}</DialogTitle>
        <DialogContent>
          <List>
            {allQuestions.map((question, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSelectQuestion(question)}
              >
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <img
                      src={getMediaUrl(question)}
                      alt={t("Media")}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <ListItemText primary={question.questionText} />
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("Cancel")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes(t("successfully")) ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddNewCoursePage;
