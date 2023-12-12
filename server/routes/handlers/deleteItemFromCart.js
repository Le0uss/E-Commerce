const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const deleteItemFromCart = async (req, res) => { // Define an async function to handle item deletion from the cart.
    const client = new MongoClient(MONGO_URI, options); // Create a new MongoDB client instance.
    try {
        await client.connect(); // Connect to the MongoDB database.
        const db = client.db("E-Commerce"); // Select the "E-Commerce" database.

        // Assuming _id is sent in the request body and is a string
        const { _id } = req.body; // Extract the item ID from the request body.

        // Query to find and delete the item with the given _id
        const result = await db.collection("Cart").deleteOne({ _id : _id});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No items found with the given _id" });
        } else {
            return res.status(200).json({ message: "Item successfully removed from the cart" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        await client.close();
    }
};

module.exports =  deleteItemFromCart  ;