const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const cartItems = async (req, res) => { // Define an async function to retrieve items in the cart.
    const client = new MongoClient(MONGO_URI, options); // Create a new MongoDB client instance.

    try {
        await client.connect(); // Connect to the MongoDB database.
        const db = client.db("E-Commerce"); // Select the "E-Commerce" database.

        // Retrieve all documents from the Cart collection
        const cartItems = await db.collection("Cart").find({}).toArray(); // Retrieve all items from the "Cart" collection.

        // Check if _id in Cart exists in Data_Items and return matching items
        const itemsToReturn = [];
        for (const cartItem of cartItems) {
            const dataItem = await db.collection("Data_Items").findOne({ _id: cartItem._id });
            if (dataItem) {
                //Renaud: just a bit of a quantity check, not really necessary but it made me able to work with
                //existing DB and set quantity to 1 if it didn't exist.
                if (!cartItem.quantity){dataItem.quantity = 1}
                else {dataItem.quantity = cartItem.quantity;} //Renaud: item data doesn't contain cart data, so we take the quantity from the cart data
                itemsToReturn.push(dataItem);
            }
        }
        console.log("items to return length",itemsToReturn.length);
        res.status(200).json(itemsToReturn);
    } catch (e) {
        res.status(500).json({ error: e.message });
    } finally {
        await client.close();
    }
};

module.exports = cartItems;