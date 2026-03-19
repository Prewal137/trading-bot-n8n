import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel, WorkflowModel, ExecutionModel, NodesModel } from "@repo/db/client";
import { SignupSchema, SigninSchema, CreateWorkflowSchema, UpdateWorkflowSchema } from "@repo/common/types";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
const app = express();
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || "";
console.log("Global JWT_SECRET length:", JWT_SECRET.length);
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
      const secret = process.env.JWT_SECRET || "";
      console.log("Signing token with secret length:", secret.length);
      const token = jwt.sign({
      id : user._id
    }, secret);
      // return the user their jwt/token;
      console.log("Generated token for user:", user._id);
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

app.post("/workflow", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId!;
  console.log("Incoming workflow creation request from userId:", userId);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { success, data } = CreateWorkflowSchema.safeParse(req.body);
  if (!success) {
      console.log("Validation failed:", data);
      res.status(403).json({
          message: "Incorrect inputs"
      })
      return
  }
  try {
      const workflow = await WorkflowModel.create({
          userId,
          nodes: data.nodes,
          edges: data.edges,
      })
      console.log("Workflow created successfully:", workflow);
      res.json({
          id: workflow._id,
          userId
      })
  } catch(e: any) {
      console.error("Failed to create workflow in DB:", e.message);
      res.status(500).json({
          message: "Internal server error"
      })
  }

});

app.put("/workflow/:workflowId", authMiddleware, async (req: Request, res: Response) => {
  const { success, data } = UpdateWorkflowSchema.safeParse(req.body);
  if (!success) {
      res.status(403).json({
          message: "Incorrect inputs"
      })
      return
  }
  try {
      await WorkflowModel.updateOne({
          _id: req.params.workflowId,
          userId: req.userId
      }, {
          nodes: data.nodes,
          edges: data.edges
      })
      res.json({
          message: "Workflow updated"
      })
  } catch(e) {
      res.status(411).json({
          message: "Failed to update workflow"
      })
  }
});

app.get("/workflow/:workflowId", authMiddleware, async (req: Request, res: Response) => {
  try {
      const workflow = await WorkflowModel.findOne({
          _id: req.params.workflowId,
          userId: req.userId
      })
      res.json({
          workflow
      })
  } catch(e) {
      res.status(411).json({
          message: "Failed to get workflow"
      })
  }
});

app.get("/workflow/executions/:workflowId", authMiddleware, async (req: Request, res: Response) => {
  try {
      const executions = await ExecutionModel.find({
          workflowId: req.params.workflowId,
      })
      res.json({
          executions
      })
  } catch(e) {
      res.status(411).json({
          message: "Failed to get executions"
      })
  }
});


app.get("/nodes", authMiddleware, async (req: Request, res: Response) => {
  try {
      const nodes = await NodesModel.find({});
      if (nodes.length === 0) {
          console.log("No nodes found in the 'nodes' collection.");
      } else {
          console.log(`Successfully fetched ${nodes.length} nodes.`);
      }
      res.json({
          nodes
      })
  } catch(e: any) {
      console.error("Error fetching nodes:", e.message);
      res.status(500).json({
          message: "Internal server error while fetching nodes"
      })
  }
});

// Clear all nodes (for development/reset)
app.delete("/nodes/clear", authMiddleware, async (req: Request, res: Response) => {
    try {
        await NodesModel.deleteMany({});
        res.json({ message: "All nodes cleared successfully" });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
});

// Bonus: Seed initial nodes if database is empty
app.post("/nodes/seed", authMiddleware, async (req: Request, res: Response) => {
    try {
        const count = await NodesModel.countDocuments();
        if (count > 0) {
            return res.status(400).json({ message: "Nodes already seeded" });
        }

        const initialNodes = [
            {
                title: "Lighter Exchange",
                description: "Place a trade on lighter",
                kind: "ACTION",
                type: "lighter",
                credentialsType: [
                    { title: "API_KEY", type: "string", required: true }
                ],
                metadataSchema: [
                    {
                        kind: "select",
                        title: "type",
                        description: "Weather it is a long or a short",
                        values: ["LONG", "SHORT"]
                    },
                    {
                        kind: "select",
                        title: "Asset",
                        description: "Which asset to long or short",
                        values: ["SOL", "BTC", "ETH"]
                    },
                    {
                        kind: "number",
                        title: "Quantity",
                        description: "How much to long or short"
                    }
                ]
            }
        ];

        await NodesModel.insertMany(initialNodes);
        res.json({ message: "Initial nodes seeded successfully" });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
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