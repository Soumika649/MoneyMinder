import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

// Add goal
router.post("/:userId", async (req, res) => {
  try {
    const { title, amount, category, targetDate } = req.body;
    const goal = new Goal({
      userId: req.params.userId,
      title,
      amount,
      category,
      targetDate: targetDate || new Date(),
    });
    await goal.save();
    res.json({ message: "Goal added", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding goal" });
  }
});

// Get goals
router.get("/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching goals" });
  }
});

// Update goal
router.put("/:goalId", async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.goalId, req.body, { new: true });
    res.json({ message: "Goal updated", goal: updatedGoal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating goal" });
  }
});

// Delete goal
router.delete("/:goalId", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.goalId);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting goal" });
  }
});

export default router;
