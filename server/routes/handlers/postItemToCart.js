const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const postItemToCart = async (req, res) => { // Define an async function to handle item addition to the cart.
    const client = new MongoClient(MONGO_URI, options); // Create a new MongoDB client instance.
    try {
        await client.connect(); // Connect to the MongoDB database.
        const db = client.db("E-Commerce"); // Select the "E-Commerce" database.
        
        // Assuming _id is sent in the request body and is a string
        const { _id,quantity } = req.body; // Extract the item ID from the request body. RENAUD: i also am extracting quantity
        // Query the 'Data_Items' collection for the item using string _id
        const item = await db.collection("Data_Items").findOne({ _id: _id });
        const inCart = await db.collection("Cart").findOne({ _id: _id });

        if (item) {
            if (!inCart) { //Renaud: checking whether item exists in cart or not
                await db.collection("Cart").insertOne({ _id: _id, quantity: 1 });  
                
                item.quantity = quantity;
                res.status(200).json({ message: "Item(s) added to cart", item });
            }
            else if (quantity > item.numInStock)
            { 
                item.quantity = item.numInStock;
                res.status(200).json({ message: `Quantity limit reached, set to ${item.numInStock}`, item });
            }
            else //if it doesn't I'm updating the quantity instead of inserting to the collection
            {
                console.log("setting to ",quantity);
                const _update = await db.collection("Cart").updateOne({"_id":_id},
                { $set: { 
                    "quantity": quantity
                }});
                
                item.quantity = quantity;
                res.status(200).json({ message: "Item in cart plus one quantity", item });
            }  

            // Insert only the _id to the 'Cart' collection as a string
            // Return the item information in the response
        } else {
            // Item not found in 'Data_Items' collection
            res.status(404).json({ message: "Item not found" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    } finally {
        client.close();
    }
};

module.exports = postItemToCart;