const db = require("../models/dbConnection");

//get Privacy Policy
exports.getPrivacyPolicy = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM privacypolicy')
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0]} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit Privacy Policy
exports.editPrivacyPolicy = async (req, res) => {
    const { dataPrivacy, id } = req.body;

    try {
        // Check if the privacyPolicyId exists in the privacyPolicy table
        const reslt = await db.queryPromise('SELECT * FROM privacypolicy WHERE id = ?', [id])
        // Check if the privacyPolicy with the given privacyPolicyId exists
        if (reslt.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }
        
        // If both id and data are valid, update the privacyPolicy
        const data = { data: dataPrivacy }
        await db.queryPromise('UPDATE privacypolicy SET ? WHERE id = ?', [data, id])

        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM privacypolicy WHERE id = ?', [id])
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0]} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
