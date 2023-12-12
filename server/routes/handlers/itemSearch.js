const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const itemSearch = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("E-Commerce");

        // Retrieve the search term from query parameters
        const searchTerm = req.query.query;
        let query = {};

        if (searchTerm) {
            // Create a case-insensitive regex search query
            query = { name: { $regex: searchTerm, $options: "i" } };
        }

        // Retrieve filtered items based on the search term
        const items = await db.collection("Data_Items").find(query).toArray();

        // Code for enriching items with company information
        const companies = await db.collection("Data_Companies").find().toArray();
        const itemsWithCompanies = items.map(item => {
            const company = companies.find(company => company.id === item.companyId);
            return { ...item, company };
        });

        res.status(200).json(itemsWithCompanies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await client.close();
    }
};

module.exports = itemSearch;