const db = require("../models/dbConnection");

//get Subscribe NewsLetter
exports.getSubscribe = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM newsletter')
        res.status(200).json({ message: 'Data retrieved successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//add Subscribe NewsLetter
exports.createSubscribe = async (req, res) => {
    const { email  } = req.body;

    try {
        //data which is add on newsletter table
        const data = { email }

        // Query the database to add the data in table
        await db.queryPromise('INSERT INTO newsletter SET ?', data)

        const results = await db.queryPromise('SELECT * FROM newsletter')

        res.json({ data: results, message: "Your Email Id has been submitted succesfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete Subscribe NewsLetter
exports.deleteSubscribe = async (req, res) => {
    let { ids } = req.body;
    try {
        // Use Promise.all to wait for all deletions to complete
        await Promise.all(ids.map(async (val) => {
            await db.queryPromise('DELETE FROM newsletter WHERE id = ?', [val]);
        }));

        const results = await db.queryPromise('SELECT * FROM newsletter');
        res.status(200).json({ message: 'Data deleted successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


