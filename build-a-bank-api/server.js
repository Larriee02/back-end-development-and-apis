
import express from "express";
import { getAccounts, saveAccounts } from "./db.js";

const app = express();
const PORT = 9000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Tiny Bank API (Express 5) running...");
});

// Transfer route - Express 5 async error handling
app.post("/transfer", async (req, res) => {
    const { fromId, toId, amount } = req.body;

    // Validate required fields
    if (!fromId || !toId || amount === undefined || amount === null) {
        const err = new Error(
            "Missing required fields: fromId, toId, amount"
        );
        err.status = 400;
        throw err;
    }

    // Validate transfer amount
    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        const err = new Error(
            "Transfer amount must be a positive number"
        );
        err.status = 400;
        throw err;
    }

    // Fetch all accounts
    const accounts = await getAccounts();

    // Find sender
    const sender = accounts.find((a) => a.id === fromId);

    if (!sender) {
        const err = new Error("Sender account not found");
        err.status = 404;
        throw err;
    }

    // Find recipient
    const recipient = accounts.find((a) => a.id === toId);

    if (!recipient) {
        const err = new Error("Recipient account not found");
        err.status = 404;
        throw err;
    }

    // Prevent transfers to the same account
    if (sender.id === recipient.id) {
        const err = new Error(
            "Cannot transfer to the same account"
        );
        err.status = 400;
        throw err;
    }

    // Check available balance
    if (sender.balance < amount) {
        const err = new Error("Insufficient funds");
        err.status = 409;
        throw err;
    }

    // Perform transfer
    sender.balance -= amount;
    recipient.balance += amount;

    // Save updated accounts
    await saveAccounts(accounts);

    // Send success response
    res.json({
        message: "Transfer successful",
        senderName: sender.owner,
        recipientName: recipient.owner,
        amountTransferred: amount,
        senderNewBalance: sender.balance,
        recipientNewBalance: recipient.balance,
    });
});

// Temporary broken route - disabled after testing
/*
app.get("/broken", (req, res, next) => {
    const err = new Error(
        "Whoops! Something went wrong on the server"
    );
    next(err);
});
*/

// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage(),
    });
});

// Get all accounts
app.get("/accounts", async (req, res) => {
    const accounts = await getAccounts();
    res.json(accounts);
});

// Get account by ID
app.get("/accounts/:id", async (req, res) => {
    const accounts = await getAccounts();

    const account = accounts.find(
        (a) => a.id === parseInt(req.params.id, 10)
    );

    if (!account) {
        const err = new Error("Account not found");
        err.status = 404;
        throw err;
    }

    res.json(account);
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            status: err.status || 500,
        },
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(
        `Tiny Bank API running on http://localhost:${PORT}...`
    );
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server...");

    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    console.log("SIGINT received. Closing server...");

    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});




