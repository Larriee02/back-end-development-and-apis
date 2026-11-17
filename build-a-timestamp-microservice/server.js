
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

// Timestamp API handler
const timestampHandler = (req, res) => {
  const inputDate = req.params.date;

  let date;

  // If no date is provided, return the current date
  if (inputDate === undefined) {
    date = new Date();
  }
  // If the input is a Unix timestamp, convert it to a number
  else if (/^-?\d+$/.test(inputDate)) {
    date = new Date(Number(inputDate));
  }
  // Otherwise, parse the input as a date string
  else {
    date = new Date(inputDate);
  }

  // Check whether the date is valid
  if (Number.isNaN(date.getTime())) {
    return res.json({
      error: "Invalid Date"
    });
  }

  // Return the Unix timestamp and UTC date
  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
};

// API routes
app.get("/api", timestampHandler);
app.get("/api/:date", timestampHandler);

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
