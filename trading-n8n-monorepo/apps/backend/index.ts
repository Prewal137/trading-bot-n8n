import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { UserModel } from "@repo/db/client";
import { SignupSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

// Routes
app.post("/signup", async (req, res) => {
  const { success, data } = SignupSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      message: "Incorrect inputs"
    });
    return;
  }
  try {
    const user = await UserModel.create({
      username: data.username,
      password: data.password
    });
    res.json({
      id: user._id
    });
  } catch (e) {
    res.status(411).json({
      message: "Username already exists"
    });
  }
});

app.post("/signin", (req, res) => {

});

app.post("/workflow", (req, res) => {

});

app.put("/workflow", (req, res) => {

});

app.get("/workflow/:workflowId", (req, res) => {

});

app.get("/workflow/executions/:workflowId", (req, res) => {

});

app.post("/credentials", (req, res) => {

});

app.get("/credentials", (req, res) => {

});

app.get("/nodes", (req, res) => {

});

async function main() {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ DB connected successfully");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    }).on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Please check if another instance of the server is running.`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", err);
      }
    });
  } catch (e) {
    console.error("❌ DB connection failed:", e);
    process.exit(1);
  }
}

main();