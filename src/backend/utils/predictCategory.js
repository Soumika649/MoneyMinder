import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn("⚠️ OPENAI_API_KEY not set — AI categorization fallback enabled.");
}

const categories = [
  "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education",
  "Investment", "Salary", "Rent", "Insurance", "Grocery", "Transportation",
  "Utilities", "Miscellaneous",
];

export async function predictCategory(description) {
  if (!openai) {
    // Fallback keyword-based categorization
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

  try {
    const prompt = `Categorize this transaction description into one of: ${categories.join(", ")}. Reply only with the exact category.\nDescription: "${description}"`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 12,
    });

    const category = response.choices?.[0]?.message?.content?.trim();
    if (category && categories.includes(category)) return category;
    return "Miscellaneous";
  } catch (err) {
    console.warn("AI categorization error:", err.message || err);
    return "Miscellaneous";
  }
}
