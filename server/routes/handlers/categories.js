const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getCategories = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("E-Commerce");

        // Retrieve categories from the items collection
        const categories = await db.collection("Data_Items")
            .distinct("category");

        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving categories");
    } finally {
        await client.close();
    }
};

module.exports = getCategories;