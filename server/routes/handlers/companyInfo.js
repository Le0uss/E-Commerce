const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = {
    useNewUrlParser: true, // Use the new URL parser for MongoDB connection strings.
    useUnifiedTopology: true, // Use the unified topology for MongoDB driver.
};

const companyInfo = async (req, res) => {
    // Define an async function named companyInfo to handle HTTP requests.

    const client = new MongoClient(MONGO_URI, options); // Create a new MongoClient instance with the MONGO_URI and options.

    try {
        await client.connect(); // Attempt to establish a connection to the MongoDB server.

        const database = client.db("E-Commerce"); // Replace with your actual database name.
        const collection = database.collection("Data_Companies"); // Access the Data_companies collection from the database.

        const data = await collection.find().toArray(); // Retrieve all documents from the Data_companies collection.
        res.json(data); // Send the retrieved data back in the HTTP response as JSON.
    } catch (e) {
        console.error(e); // Log any errors that occur.
        res.status(500).send("Error fetching data from Data_companies collection"); // Send an error response.
    } finally {
        await client.close(); // Ensure that the database connection is closed.
    }
};

module.exports = companyInfo; // Export the companyInfo function for use in other parts of the application.
