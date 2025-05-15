const db = require("../../models/dbConnection");

//get banner
exports.getBanner = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM homebanner')
        const para = await db.queryPromise('SELECT * FROM homebannerparagraph WHERE homebannerId = ?', [results[0].id])
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0], para: para} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//add banner
exports.createBanner = async (req, res) => {
    const { heading, para } = req.body;

    try {
        // Check if an back image file was uploaded
        if (!req.files.backImg) {
            return res.status(400).json({ message: "Please upload an back image." });
        }

        // Check if an front image file was uploaded
        if (!req.files.frontImg) {
            return res.status(400).json({ message: "Please upload an front image." });
        }

        //data which is add on homebanner table
        const data = { heading, backImg: req.files.backImg[0].filename, frontImg: req.files.frontImg[0].filename }

        // Query the database to add the data in table
        const resultsBanner = await db.queryPromise('INSERT INTO homebanner SET ?', data)

        await JSON.parse(para).forEach(async (item) => {
            //data which is add on homebannerparagraph table
            const paragraph = { p: item.p, homebannerId: resultsBanner.insertId }

            // Query the database to add the data in table
            await db.queryPromise('INSERT INTO homebannerparagraph SET ?', paragraph);
        })
        res.json({ data: {id: resultsBanner.insertId, heading, backImg: req.files.backImg[0].filename, frontImg: req.files.frontImg[0].filename, p: JSON.parse(para)}, message: "Your data has been succesfully submitted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


// edit banner
exports.editBanner = async (req, res) => {
    const { heading, backImg, frontImg, para, id } = req.body;

    try {

        // Check if the homeId exists in the home table
        const homeResults = await db.queryPromise('SELECT * FROM homebanner WHERE id = ?', [id])
        // Check if the home with the given homeId exists
        if (homeResults.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        //get the pargraph data
        const r = await db.queryPromise('SELECT * FROM homebannerparagraph WHERE homebannerId = ?', [id])

        //store all update para ids which para is already exist
        const ids = []
        JSON.parse(para).forEach((val) => {
            if(val.id !== undefined) {
                ids.push(val.id.toString())
            }
        })
        
        // If both id and data are valid, update the home
        const data = { 
            heading, 
            backImg: backImg === undefined ? req.files.backImg[0].filename : backImg, 
            frontImg: frontImg === undefined ? req.files.frontImg[0].filename : frontImg, 
        }
        await db.queryPromise('UPDATE homebanner SET ? WHERE id = ?', [data, id])

        let latestPara = [...r, ...JSON.parse(para)]
        //if paragraph is already exist then update otherwise delete and if new para is added add it
        await Promise.all(latestPara.map(async (val) => {
            if (val.id === undefined) {
                const addedPara = { p: val.p, homebannerId: homeResults[0].id };
                await db.queryPromise('INSERT INTO homebannerparagraph SET ?', addedPara);
            } else {
                if (ids.includes(val.id.toString())) {
                    let pd = null
                    await JSON.parse(para).map(async (v) => {
                        if(v.id !== undefined && val.id === v.id){
                            pd = v
                        }
                    });

                    const updatePara = { p: pd.p };
                    await db.queryPromise('UPDATE homebannerparagraph SET ? WHERE id = ?', [updatePara, val.id]);
                } else {
                    await db.queryPromise('DELETE FROM homebannerparagraph WHERE id = ?', [val.id]);
                }
            }
        }));
        
        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM homebanner WHERE id = ?', [id])
        const pd = await db.queryPromise('SELECT * FROM homebannerparagraph WHERE homebannerId = ?', [homeResults[0].id]);
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0], para: pd} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
