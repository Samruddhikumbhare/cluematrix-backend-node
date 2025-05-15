const db = require("../models/dbConnection");

//get terms condition
exports.getRefundPolicy = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM refundpolicy')
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0]} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit terms condition
exports.editRefundPolicy = async (req, res) => {
    const { dataPrivacy, id } = req.body;

    try {
        // Check if the refundpolicyId exists in the refundpolicy table
        const reslt = await db.queryPromise('SELECT * FROM refundpolicy WHERE id = ?', [id])
        // Check if the refundpolicy with the given refundpolicyId exists
        if (reslt.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }
        
        // If both id and data are valid, update the refundpolicy
        const data = { data: dataPrivacy }
        await db.queryPromise('UPDATE refundpolicy SET ? WHERE id = ?', [data, id])

        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM refundpolicy WHERE id = ?', [id])
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0]} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
