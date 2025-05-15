const db = require("../models/dbConnection");

//get Compancy Contact Info
exports.getContact = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM contactinfo')
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0]} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit Compancy Contact Info
exports.editContact = async (req, res) => {
    const { contact_no, email, address, location, id } = req.body;

    try {
        // Check if the contactinfoId exists in the contactinfo table
        const reslt = await db.queryPromise('SELECT * FROM contactinfo WHERE id = ?', [id])
        // Check if the contactinfo with the given contactinfoId exists
        if (reslt.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }
        
        // If both id and data are valid, update the contactinfo
        const data = { contact_no, email, address, location }
        await db.queryPromise('UPDATE contactinfo SET ? WHERE id = ?', [data, id])

        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM contactinfo WHERE id = ?', [id])
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0]} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
