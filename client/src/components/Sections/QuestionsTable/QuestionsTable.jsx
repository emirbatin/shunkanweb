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

const QuestionsTable = ({ questions }) => {
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

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography variant="h6" className="text-2xl font-bold mb-4 text-left">
          Questions
        </Typography>
        <Tooltip title={"Add new question"}>
        <IconButton color="primary" href="">
          <AddIcon />
        </IconButton>
        </Tooltip>
      </div>
      <br />
      <TextField
        label="Search by Title"
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
              <TableCell>Media</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Correct Answer</TableCell>
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
                <TableCell>{question.questionText}</TableCell>
                <TableCell>{question.points}</TableCell>
                <TableCell>{question.correctAnswer}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QuestionsTable;
