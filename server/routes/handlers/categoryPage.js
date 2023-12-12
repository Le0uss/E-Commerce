const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const categoryPage = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("E-Commerce");

        // Extract category and page from URL parameters
        const category = req.params.category;
        const page = req.params.page ? parseInt(req.params.page) : 1;
        const limit = 20; // Maintaining the same number of items per page as in itemsByPage
        const skip = (page - 1) * limit;

        // Retrieve items filtered by category with pagination
        const items = await db.collection("Data_Items")
                              .find({ category: category })
                              .skip(skip)
                              .limit(limit)
                              .toArray();

        // Retrieve companies, same as in itemsByPage
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

module.exports = categoryPage;
