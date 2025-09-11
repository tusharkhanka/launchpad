import express from "express";
import cors from "cors";

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

// Simple route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
