const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const purchaseItem = async (req, res) => { // Define an async function to handle item purchase requests.
    const client = new MongoClient(MONGO_URI, options); // Create a new MongoDB client instance.
    const itemId = req.body.itemId; // Extract the item ID from the request body.
    const quantity = req.body.quantity;  // Number of items the user wants to purchase // Extract the quantity of items to purchase.

    try {
        await client.connect(); // Connect to the MongoDB database.
        const db = client.db("E-Commerce");

        // Check current stock for the item
        const item = await db.collection("Data_Items").findOne({ _id: itemId });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.numInStock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        // Update the stock count
        const newStock = item.numInStock - quantity;
        await db.collection("Data_Items").updateOne({ _id: itemId }, { $set: { numInStock: newStock } });

        // Remove the item if no stock is left
        if (newStock === 0) {
            await db.collection("Data_Items").deleteOne({ _id: itemId });
        }
        await db.collection("Cart").deleteMany({})
        res.status(200).json({ message: "Purchase successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await client.close();
    }
};

module.exports = purchaseItem;