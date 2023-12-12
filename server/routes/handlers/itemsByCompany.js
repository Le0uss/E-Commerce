const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const itemsByCompanyName = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("E-Commerce");

        // Extract company name from URL parameters
        const companyName = req.params.companyName;

        // Retrieve company ID for the given company name
        const company = await db.collection("Data_Companies")
                                .findOne({ name: companyName });
        // Find the _id in Data_Companies that matches the companyId in Data_Items
        const matchingCompanyId = company ? company._id : null;

        if (matchingCompanyId) {
            // Retrieve items for the found company ID
            const items = await db.collection("Data_Items")
                                  .find({ companyId: matchingCompanyId })
                                  .toArray();

            res.json(items);
        } else {
            res.status(404).send("Company not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving items");
    } finally {
        await client.close();
    }
};

module.exports = itemsByCompanyName;
