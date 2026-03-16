import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Backend running"
  });
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});