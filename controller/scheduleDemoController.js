const db = require("../models/dbConnection");

//get Schedule Demo
exports.getScheduleDemo = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM scheduledemo')
        for(let i=0; i < results.length; i++) {
            results[i] = {
                ...results[i], 
                product: await db.queryPromise('SELECT * FROM product WHERE id  = ?', [results[i].productId]),
            }
        }
        res.status(200).json({ message: 'Data retrieved successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//add Schedule Demo
exports.createScheduleDemo = async (req, res) => {
    const { name, email, mobile, date, time, productId  } = req.body;

    try {
        //data which is add on scheduledemo table
        const data = { name, email, mobile, date, time, productId  }

        // Query the database to add the data in table
        await db.queryPromise('INSERT INTO scheduledemo SET ?', data)

        const resultsres = await db.queryPromise('SELECT * FROM scheduledemo')
        for(let i=0; i < resultsres.length; i++) {
            resultsres[i] = {
                ...resultsres[i], 
                product: await db.queryPromise('SELECT * FROM product WHERE id  = ?', [resultsres[i].productId]),
            }
        }

        res.json({ data: resultsres, message: "Your data has been submitted succesfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete Schedule Demo
exports.deleteScheduleDemo = async (req, res) => {
    let { ids } = req.body;
    try {
        // Use Promise.all to wait for all deletions to complete
        await Promise.all(ids.map(async (val) => {
            await db.queryPromise('DELETE FROM scheduledemo WHERE id = ?', [val]);
        }));

        const results = await db.queryPromise('SELECT * FROM scheduledemo')
        for(let i=0; i < results.length; i++) {
            results[i] = {
                ...results[i], 
                product: await db.queryPromise('SELECT * FROM product WHERE id  = ?', [results[i].productId]),
            }
        }
        res.status(200).json({ message: 'Data deleted successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


