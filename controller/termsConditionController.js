const db = require("../models/dbConnection");

//get terms condition
exports.getTermsCondition = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM termscondition')
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0]} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit terms condition
exports.editTermsCondition = async (req, res) => {
    const { dataPrivacy, id } = req.body;

    try {
        // Check if the termsconditionId exists in the termscondition table
        const reslt = await db.queryPromise('SELECT * FROM termscondition WHERE id = ?', [id])
        // Check if the termscondition with the given termsconditionId exists
        if (reslt.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }
        
        // If both id and data are valid, update the termscondition
        const data = { data: dataPrivacy }
        await db.queryPromise('UPDATE termscondition SET ? WHERE id = ?', [data, id])

        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM termscondition WHERE id = ?', [id])
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0]} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
