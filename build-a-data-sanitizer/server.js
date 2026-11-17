
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inputCleaner, inputValidator } from "./middleware.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

// Parse submitted form data
app.use(express.urlencoded({ extended: false }));

// Redirect the homepage before serving static files
app.get("/", (req, res) => {
  res.redirect("/form");
});

// Serve the HTML form
app.get("/form", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Serve other static files
app.use(express.static(publicDir));

// Handle form submission
app.post(
  "/submit",
  inputCleaner,
  inputValidator,
  (req, res) => {
    res.json({
      username: req.body.username,
      comment: req.body.comment
    });
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

