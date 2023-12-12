const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// ...

const getItemById = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("E-Commerce");

        const collection = db.collection("Data_Items");

        // Retrieve the specific item
        const itemId = req.params._id; // assuming _id is passed as a parameter in the request
        const item = await collection.findOne({ _id: parseInt(itemId) }); // parseInt is used since _id in JSON seems to be a number

        if (!item) {
            return res.status(404).send("Item not found");
        }

        // Retrieve all companies and create a map
        const companies = await db.collection("Data_Companies").find().toArray();
        const companiesMap = new Map(companies.map(company => [company._id, company]));

        // Get the corresponding company information
        const companyInfo = companiesMap.get(item.companyId); // Corrected here

        // Nest the specific fields of company information inside the item
        const itemWithCompany = {
            ...item,
            company: companyInfo ? {
                name: companyInfo.name,
                url: companyInfo.url,
                country: companyInfo.country
            } : null
        };

        // Return the item with nested company information
        res.status(200).json(itemWithCompany);
    } catch (e) {
        res.status(500).send("Server error: " + e.message);
    } finally {
        await client.close();
    }
};



module.exports = getItemById