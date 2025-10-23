// transactions.js
import express from "express";
import multer from "multer";
import fs from "fs";
import csvParser from "csv-parser";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// --------------------
// MULTER SETUP
// --------------------
const upload = multer({ dest: "uploads/" });

// --------------------
// AI CATEGORY PREDICTION (Fallback if OpenAI not used)
// --------------------
async function predictCategory(description) {
  const categories = [
    "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education",
    "Investment", "Salary", "Rent", "Insurance", "Grocery", "Transportation",
    "Utilities", "Miscellaneous", "Emergency Fund" , "Vacation"
  ];

  const d = (description || "").toLowerCase();
  if (d.includes("zomato") || d.includes("swiggy") || d.includes("restaurant") || d.includes("food")) return "Food";
  if (d.includes("uber") || d.includes("ola") || d.includes("flight") || d.includes("train") || d.includes("bus")) return "Travel";
  if (d.includes("rent") || d.includes("flat") || d.includes("lease")) return "Rent";
  if (d.includes("amazon") || d.includes("flipkart") || d.includes("mall") || d.includes("store")) return "Shopping";
  if (d.includes("electricity") || d.includes("wifi") || d.includes("bill") || d.includes("water")) return "Bills";
  if (d.includes("insurance") || d.includes("policy")) return "Insurance";
  if (d.includes("netflix") || d.includes("spotify") || d.includes("prime") || d.includes("subscription")) return "Miscellaneous";
  if (d.includes("school") || d.includes("college") || d.includes("course") || d.includes("tuition")) return "Education";
  if (d.includes("salary") || d.includes("payroll")) return "Salary";
  if (d.includes("stock") || d.includes("crypto") || d.includes("mutual")) return "Investment";
  if (d.includes("doctor") || d.includes("hospital") || d.includes("clinic") || d.includes("medicine")) return "Health";
  return "Miscellaneous";
}

// --------------------
// ADD TRANSACTION
// --------------------
router.post("/:userId", async (req, res) => {
  try {
    const { description, date, amount, type, category: providedCategory } = req.body;
    const { userId } = req.params;

    if (!description || amount === undefined || !type)
      return res.status(400).json({ message: "Missing required fields" });

    const category = providedCategory || (await predictCategory(description));
    const transaction = new Transaction({
      userId,
      description,
      category,
      date: date || new Date(),
      type,
      amount: Number(amount),
    });

    await transaction.save();
    res.json({ message: "Transaction added", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding transaction" });
  }
});

// --------------------
// GET ALL TRANSACTIONS
// --------------------
router.get("/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// --------------------
// CSV UPLOAD
// --------------------
router.post("/:userId/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const filePath = req.file.path;
    const userId = req.params.userId;
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        const processed = await Promise.all(
          rows.map(async (r) => {
            const desc = r.description || r.Details || r.Description || "";
            const amt = Number(r.amount || r.Amount || r.AMT || 0);
            const type = r.type || (amt < 0 ? "Expense" : "Income");
            const category = r.category || (await predictCategory(desc));
            const date = r.date || r.Date || new Date();
            return { userId, description: desc, date: new Date(date), type, amount: Math.abs(amt), category };
          })
        );

        await Transaction.insertMany(processed);
        try { fs.unlinkSync(filePath); } catch (e) {}
        res.json({ message: "CSV uploaded successfully", count: processed.length });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "CSV upload failed" });
  }
});

export default router;
