import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve everything in the repo root (index.html, styles/, script/, images, etc.)
app.use(express.static(__dirname));

// Fallback to index.html for the root (optional; helps if you later add routes)
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// IMPORTANT on Render: use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Listening on ${PORT}`);
});


//Use render to upload your website from git
//run it and also commit changes live on your website from your git clone in vscode
//what is app.mjs?