const db = require("../models/dbConnection");

//get about
exports.getAbout = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM about')
        const para = await db.queryPromise('SELECT * FROM aboutparagraph WHERE aboutId = ?', [results[0].id])
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0], para: para} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//add about
exports.createAbout = async (req, res) => {
    const { heading, para, small_heading  } = req.body;

    try {
        // Check if an image file was uploaded
        if (!req.files.image) {
            return res.status(400).json({ message: "Please upload a image." });
        }

        //data which is add on about table
        const data = { heading, image: req.files.image[0].filename, small_heading }

        // Query the database to add the data in table
        const resultsAbout = await db.queryPromise('INSERT INTO about SET ?', data)

        await JSON.parse(para).forEach(async (item) => {
            //data which is add on aboutparagraph table
            const paragraph = { p: item.p, aboutId: resultsAbout.insertId }

            // Query the database to add the data in table
            await db.queryPromise('INSERT INTO aboutparagraph SET ?', paragraph);
        })
        res.json({ data: {id: resultsAbout.insertId, heading, image: req.files.image[0].filename, p: JSON.parse(para)}, small_heading, message: "Your data has been succesfully submitted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


// edit about
exports.editAbout = async (req, res) => {
    const { heading, image, para, id, small_heading } = req.body;

    try {

        // Check if the aboutId exists in the about table
        const Results = await db.queryPromise('SELECT * FROM about WHERE id = ?', [id])
        // Check if the about with the given aboutId exists
        if (Results.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        //get the pargraph data
        const r = await db.queryPromise('SELECT * FROM aboutparagraph WHERE aboutId = ?', [id])

        //store all update para ids which para is already exist
        const ids = []
        JSON.parse(para).forEach((val) => {
            if(val.id !== undefined) {
                ids.push(val.id.toString())
            }
        })
        
        // If both id and data are valid, update the about
        const data = { 
            heading, 
            image: image === undefined ? req.files.image[0].filename : image, 
            small_heading
        }
        await db.queryPromise('UPDATE about SET ? WHERE id = ?', [data, id])

        let latestPara = [...r, ...JSON.parse(para)];

        //if paragraph is already exist then update otherwise delete and if new para is added add it
        await Promise.all(latestPara.map(async (val) => {
            if (val.id === undefined) {
                const addedPara = { p: val.p, aboutId: Results[0].id };
                await db.queryPromise('INSERT INTO aboutparagraph SET ?', addedPara);
            } else {
                if (ids.includes(val.id.toString())) {
                    let pd = null
                    await JSON.parse(para).map(async (v) => {
                        if(v.id !== undefined && val.id === v.id){
                            pd = v
                        }
                    });                    
                    const updatePara = { p: pd.p };
                    await db.queryPromise('UPDATE aboutparagraph SET ? WHERE id = ?', [updatePara, val.id]);
                } else {
                    await db.queryPromise('DELETE FROM aboutparagraph WHERE id = ?', [val.id]);
                }
            }
        }));
        
        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM about WHERE id = ?', [id])
        const pd = await db.queryPromise('SELECT * FROM aboutparagraph WHERE aboutId = ?', [Results[0].id]);
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0], para: pd} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
