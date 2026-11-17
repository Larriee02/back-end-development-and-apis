
import express from "express";
import apiRouter from "./routes/api.routes.js";
import {
  notFoundHandler,
  finalErrorHandler
} from "./middleware/error.middleware.js";

const app = express();

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount API routes
app.use("/api", apiRouter);

// Error-handling middleware — order matters
app.use(notFoundHandler);
app.use(finalErrorHandler);

app.listen(3000, () => {
  console.log("Server URL: http://localhost:3000");
});
