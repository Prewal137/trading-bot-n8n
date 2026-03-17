import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Backend running"
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});