// API code
const express = require("express");
const mongo = require("mongodb").MongoClient;

// Initialize app
const app = express();

// Mongo server url
const url = "mongodb://localhost:27017";

let db, trips, expenses;

// Use express.json() middleware to parse JSON
app.use(express.json());

// Add endpoints - trip, trips, expense, expenses
// Add a trip
app.post("/trip", (request, response) => {
  // Get name
  const name = request.body.name;
  trips.insertOne({ name: name }, (error, result) => {
    if (error) {
      console.error(error);
      response.status(500).json({ error: error });
      return;
    }

    console.log(result);
    response.status(200).json({ ok: true });
  });
});

// Get lists of trips
app.get("/trips", (request, response) => {
  trips.find().toArray((error, items) => {
    if (error) {
      console.error(error);
      response.status(500).json({ error: error });
      return;
    }

    response.status(200).json({ trips: items });
  });
});
app.post("/expense", (request, response) => {
  expenses.insertOne(
    {
      trip: request.body.trip,
      date: request.body.date,
      amount: request.body.amount,
      category: request.body.category,
      description: request.body.description,
    },
    (error, result) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: error });
        return;
      }

      response.status(200).json({ ok: true });
    }
  );
});
app.get("/expenses", (request, response) => {
  expenses.find({trip: request.body.trip}).toArray((error, items) => {
    if(error) {
      console.error(error)
      response.status(500).json({error: error})
      return
    }

    response.status(200).json({trips: items})
  })
});

// Start the server
app.listen(3000, () => console.log("Server ready"));

// Connect DB using connect method
mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopolgy: true,
  },
  (error, client) => {
    if (error) {
      console.error(error);
      return;
    }
    // Create database
    db = client.db("tripExpensesDB");
    // Create tables
    trips = db.collection("trips");
    expenses = db.collection("expenses");
  }
);
