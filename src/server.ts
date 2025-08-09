import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT ?? 3000;

// 静的ファイル（生HTML/CSS/JS）を配信
app.use(express.static(path.join(__dirname, "..", "public")));

// APIの例
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from TypeScript Node!" });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
