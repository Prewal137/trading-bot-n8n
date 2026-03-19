import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "@repo/db/client";
import { SignupSchema,SigninSchema } from "@repo/common/types";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET;
// Routes
app.post("/signup", async (req: Request, res: Response) => {
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
    })
    res.json({
      id: user._id
    });
  } catch (e) {
    res.status(411).json({
      message: "Username already exists"
    });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const { success, data } = SigninSchema.safeParse(req.body);
  if (!success) {
    res.status(403).json({
      message: "Incorrect inputs"
    });
    return;
  }
  try {
    const user = await UserModel.findOne({
      username: data.username,
      password: data.password
    })
    if (user) {
      const token = jwt.sign({
      id : user._id
    }, JWT_SECRET as string);
      // return the user their jwt/token;
      res.json({
        id: user._id,
        token
      })
    } else {
      res.status(403).json({
        message: "Incorrect credentials"
      })
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal server error"
    });
  }

});

app.post("/workflow", authMiddleware, (req, res) => {

});

app.put("/workflow", authMiddleware, (req, res) => {

});

app.get("/workflow/:workflowId", authMiddleware, (req, res) => {

});

app.get("/workflow/executions/:workflowId", authMiddleware, (req, res) => {

});


app.get("/nodes", authMiddleware, (req, res) => {

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