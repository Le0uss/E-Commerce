const { MongoClient } = require("mongodb"); // Import MongoClient from the MongoDB driver.
require("dotenv").config(); // Load environment variables from a .env file.

const { MONGO_URI } = process.env; // Extract the MONGO_URI environment variable.
const options = { // Define options for the MongoDB client.
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const itemsByPage = async (req, res) => { // Define an async function for pagination.
    const client = new MongoClient(MONGO_URI, options); // Create a new MongoDB client instance.

    try {
        await client.connect(); // Connect to the MongoDB database.
        const db = client.db("E-Commerce"); // Select the "E-Commerce" database.

        // Adding pagination // Comment indicating the start of pagination logic.
        const page = req.params.page ? parseInt(req.params.page) : 1; // Determine the current page number.
        const limit = 20; // Set the number of items per page to 20.
        const skip = (page - 1) * limit;

        // Retrieve items with pagination
        const items = await db.collection("Data_Items")
                              .find()
                              .skip(skip)
                              .limit(limit)
                              .toArray();

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

        res.json(itemsWithCompanies);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving items");
    } finally {
        await client.close();
    }
};

module.exports = itemsByPage;