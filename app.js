/** Simple demo Express app. */

const express = require("express");
const app = express();

const { findMean, findMedian, findMode } = require("./stats");
const { convertStrNums } = require("./utils");

// useful error class to throw
const { NotFoundError } = require("./expressError");

const MISSING = "Expected key `nums` with comma-separated list of numbers.";


/** Finds mean of nums in qs: returns {operation: "mean", result } */
app.get("/mean", function (req, res) {
  if (req.query.nums) {
    const queryString = req.query.nums;
    let queryArray = queryString.split(",");
    queryArray = convertStrNums(queryArray);

    const mean = findMean(queryArray);

    return res.json({ response: { operation: "mean", value: mean } });
  }

  throw new NotFoundError(MISSING);

});

/** Finds median of nums in qs: returns {operation: "median", result } */
app.get("/median", function (req, res) {
  if (req.query.nums) {
    const queryString = req.query.nums;
    let queryArray = queryString.split(",");
    queryArray = convertStrNums(queryArray);

    const median = findMedian(queryArray);

    return res.json({ response: { operation: "median", value: median } });
  }

  throw new NotFoundError(MISSING);

});


/** Finds mode of nums in qs: returns {operation: "mode", result } */
app.get("/mode", function (req, res) {
  if (req.query.nums) {
    const queryString = req.query.nums;
    let queryArray = queryString.split(",");
    queryArray = convertStrNums(queryArray);

    const mode = findMode(queryArray);

    return res.json({ response: { operation: "mode", value: mode } });
  }

  throw new NotFoundError(MISSING);

});


/** Finds mean,medianmode of nums in qs: returns {operation: "all", mean , median, mode} */
app.get("/all", function (req, res) {
  if (req.query.nums) {
    const queryString = req.query.nums;
    let queryArray = queryString.split(",");
    queryArray = convertStrNums(queryArray);

    const mean = findMean(queryArray);
    const median = findMedian(queryArray);
    const mode = findMode(queryArray);

    return res.json({
      response: {
        operation: "all", "mean": mean,
        "median": median, "mode": mode,
      }
    });
  }

  throw new NotFoundError(MISSING);

});

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;