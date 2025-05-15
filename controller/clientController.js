const db = require("../models/dbConnection");

//get clients
exports.getClients = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM clients')
        const clientDetails = await db.queryPromise('SELECT * FROM clientlogolink WHERE clientId = ?', [results[0].id])
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0], clientDetails: clientDetails} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit clients
exports.editClients = async (req, res) => {
    let { heading, paragraph, clientDetails, id } = req.body;
    try {
        let count = 0
        // Here, you can process the uploaded images and associate them with clientDetails as needed
        clientDetails = JSON.parse(clientDetails).map((val, ind) => {
            let img = val.image !== "" ? val.image : req.files.image[count]
            if(val.image === "") {
                count= count +1
            }
            return {
                ...val,
                image: img, // Use index to associate images with clientDetails
            };
        });

        // Check if the clientId exists in the client table
        const clientData = await db.queryPromise('SELECT * FROM clients WHERE id = ?', [id])
        // Check if the client with the given clientId exists
        if (clientData.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        //get the pargraph data
        const r = await db.queryPromise('SELECT * FROM clientlogolink WHERE clientId = ?', [id])

        //store all update clientDetails ids which clientDetails is already exist
        const ids = []
        clientDetails.forEach((val) => {
            if(val.id !== undefined) {
                ids.push(val.id.toString())
            }
        })
        
        // If both id and data are valid, update the client
        const data = { heading, paragraph }
        await db.queryPromise('UPDATE clients SET ? WHERE id = ?', [data, id])

        let latestSer = [...r, ...clientDetails];
        //if clientDetails is already exist then update otherwise delete and if new clientDetails is added add it
        await Promise.all(latestSer.map(async (val, ind) => {
            if (val.id === undefined) {
                const addedSer = { 
                    website_link: val.website_link,
                    image: val.image.filename,
                    clientId: clientData[0].id
                };
                await db.queryPromise('INSERT INTO clientlogolink SET ?', addedSer);
            } else {
                if (ids.includes(val.id.toString())) {
                    let pd = null
                    await clientDetails.map(async (v) => {
                        if(v.id !== undefined && val.id === v.id){
                            pd = v
                        }
                    });
                    const updateSer = { 
                        website_link: val.website_link,
                        image: typeof val.image === "string" ? val.image : val.image.filename,
                     };
                    await db.queryPromise('UPDATE clientlogolink SET ? WHERE id = ?', [updateSer, val.id]);
                } else {
                    await db.queryPromise('DELETE FROM clientlogolink WHERE id = ?', [val.id]);
                }
            }
        }));
        
        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM clients WHERE id = ?', [id])
        const pd = await db.queryPromise('SELECT * FROM clientlogolink WHERE clientId = ?', [clientData[0].id]);
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0], clientDetails: pd} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
