import mongoose from "mongoose";
import { WorkflowModel, NodesModel } from "@repo/db";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "";

async function verify() {
  if (!MONGO_URL) {
    console.error("MONGO_URL not found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const workflowCount = await WorkflowModel.countDocuments();
    console.log(`Total workflows: ${workflowCount}`);

    const latestWorkflows = await WorkflowModel.find().sort({ _id: -1 }).limit(3);
    console.log("Latest 3 workflows:");
    latestWorkflows.forEach((w, i) => {
      console.log(`\n--- Workflow ${i + 1} ---`);
      console.log(`ID: ${w._id}`);
      console.log(`User ID: ${w.userId}`);
      console.log(`Nodes: ${w.nodes.length}`);
      console.log(`Edges: ${w.edges.length}`);
      w.nodes.forEach((node: any, ni: number) => {
          console.log(`  Node ${ni + 1}: ${node.id} (type: ${node.nodeId}, kind: ${node.data?.kind})`);
      });
    });

    const nodeDefCount = await NodesModel.countDocuments();
    console.log(`\nTotal node definitions: ${nodeDefCount}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Verification failed:", err);
  }
}

verify();
