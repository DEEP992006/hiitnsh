import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/");
      const sorted = res.data.sort((a, b) => {
        if (b.score === a.score) {
          return a.time - b.time; // Faster time wins if scores are equal
        }
        return b.score - a.score;
      });
      setQuizzes(sorted);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all quiz records?")) {
      try {
        await axios.get("http://localhost:8080/delete");
        setQuizzes([]);
      } catch (err) {
        console.error("Error deleting data", err);
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Quiz Leaderboard</h1>
        <button className="delete-btn" onClick={handleDeleteAll}>
          🗑️ Delete All
        </button>
      </header>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <p>No quiz submissions yet.</p>
        </div>
      ) : (
        <div className="quiz-table-container">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Score</th>
                <th>Time (sec)</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q, index) => (
                <tr key={q._id || index}>
                  <td>
                    <span className="rank-badge">{index + 1}</span>
                  </td>
                  <td>{q.uname}</td>
                  <td className="email-col">{q.email}</td>
                  <td className="score">{q.score}</td>
                  <td>{q.time}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;