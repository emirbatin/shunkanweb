import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const QuestionsTable = ({ questions }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState(questions);

  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredQuestions(
      questions.filter((question) =>
        question.title.toLowerCase().includes(term)
      )
    );
  };

  const handleClick = () => {
    navigate("/add-new-question");
    console.log(t("Add new question clicked"));
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h6" className="text-2xl font-bold mb-4 text-left">
          {t("questions")}
        </Typography>
        <Tooltip title={t("Add new question")}>
          <IconButton color="primary" onClick={handleClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <br />
      <TextField
        label={t("Search by Title")}
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />

      <TableContainer component={Paper} className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("media")}</TableCell>
              <TableCell>{t("id")}</TableCell>
              <TableCell>{t("question")}</TableCell>
              <TableCell>{t("point")}</TableCell>
              <TableCell>{t("correctanswer")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question._id}>
                <TableCell>
                  {question.mediaUrl && (
                    <img
                      src={question.mediaUrl}
                      alt={question.questionText}
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </TableCell>
                <TableCell>{question._id}</TableCell>
                <TableCell>{t(question.questionText)}</TableCell>
                <TableCell>{question.points}</TableCell>
                <TableCell>{question.correctAnswer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QuestionsTable;
