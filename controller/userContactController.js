const db = require("../models/dbConnection");

//get User Contact
exports.getUserContact = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM usercontact')
        res.status(200).json({ message: 'Data retrieved successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//add User Contact
exports.createUserContact = async (req, res) => {
    const { name, email, mobile, msg  } = req.body;

    try {
        //data which is add on usercontact table
        const data = { name, email, mobile, msg  }

        // Query the database to add the data in table
        await db.queryPromise('INSERT INTO usercontact SET ?', data)

        const results = await db.queryPromise('SELECT * FROM usercontact')

        res.json({ data: results, message: "Your Email Id has been submitted succesfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete User Contact
exports.deleteUserContact = async (req, res) => {
    let { ids } = req.body;
    try {
        // Use Promise.all to wait for all deletions to complete
        await Promise.all(ids.map(async (val) => {
            await db.queryPromise('DELETE FROM usercontact WHERE id = ?', [val]);
        }));

        const results = await db.queryPromise('SELECT * FROM usercontact');
        res.status(200).json({ message: 'Data deleted successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


