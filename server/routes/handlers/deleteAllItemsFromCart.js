const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
useNewUrlParser: true,
useUnifiedTopology: true,
};


const deleteAllItemsFromCart = async (request, response) => {
const client = new MongoClient(MONGO_URI, options);

try {
    await client.connect();
    const db = client.db("E-Commerce");
    console.log("Connected!");

    // Check if there are items in the cart
    const cartItems = await db.collection("Cart").find().toArray();
    if (cartItems.length === 0) {
    response.status(404).json({
        status: 404,
        message: "No items found in the cart.",
    });
    return;
    }

    // Delete all items from the cart
    const result = await db.collection("Cart").deleteMany({});

    response.status(200).json({
    status: 200,
    message: "All items deleted from the cart.",
    deletedCount: result.deletedCount,
    });
} catch (error) {
    console.error(error);
    response.status(500).json({
    status: 500,
    message: "Server error",
    });
} finally {
    client.close();
    console.log("Disconnected!");
}
};

module.exports = deleteAllItemsFromCart 