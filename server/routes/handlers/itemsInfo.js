const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const itemsInfo = async (req, res) => { // Define an async function to retrieve items with company information.
    const client = new MongoClient(MONGO_URI, options); // Create a new MongoDB client instance.

    try {
        await client.connect(); // Connect to the MongoDB database.
        const db = client.db("E-Commerce"); // Select the "E-Commerce" database.

        // Retrieve items
        const items = await db.collection("Data_Items").find().toArray(); // Retrieve all items from the "Data_Items" collection.

        // Retrieve companies
        const companies = await db.collection("Data_Companies").find().toArray();
        const companiesMap = new Map(companies.map(company => [company._id, company]));

        // Merge company information with items
        const itemsWithCompanies = items.map(item => {
            const companyInfo = companiesMap.get(item.companyId);
            return {
                ...item,
                company: companyInfo ? {
                    name: companyInfo.name,
                    url: companyInfo.url,
                    country: companyInfo.country
                } : null
            };
        });

        res.status(200).json(itemsWithCompanies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        await client.close();
    }
};

module.exports = itemsInfo;