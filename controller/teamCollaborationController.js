const db = require("../models/dbConnection");

//get teamcollaborations
exports.getteamCollaborations = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM teamcollaborations')
        const teamCollaborationDetails = await db.queryPromise('SELECT * FROM teamcollaborationlogolink WHERE teamCollaborationId = ?', [results[0].id])
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0], teamCollaborationDetails: teamCollaborationDetails} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit teamCollaborations
exports.editteamCollaborations = async (req, res) => {
    let { heading, paragraph,  teamCollaborationDetails, id } = req.body;
    try {
        let count = 0
        // Here, you can process the uploaded images and associate them with teamCollaborationDetails as needed
        teamCollaborationDetails = JSON.parse(teamCollaborationDetails).map((val, ind) => {
            let img = val.image !== "" ? val.image : req.files.image[count]
            if(val.image === "") {
                count= count +1
            }
            return {
                ...val,
                image: img, // Use index to associate images with teamCollaborationDetails
            };
        });

        // Check if the teamCollaborationId exists in the teamCollaboration table
        const teamCollaborationData = await db.queryPromise('SELECT * FROM teamcollaborations WHERE id = ?', [id])
        // Check if the teamCollaboration with the given teamCollaborationId exists
        if (teamCollaborationData.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        //get the pargraph data
        const r = await db.queryPromise('SELECT * FROM teamcollaborationlogolink WHERE teamCollaborationId = ?', [id])

        //store all update teamCollaborationDetails ids which teamCollaborationDetails is already exist
        const ids = []
        teamCollaborationDetails.forEach((val) => {
            if(val.id !== undefined) {
                ids.push(val.id.toString())
            }
        })
        
        // If both id and data are valid, update the teamCollaboration
        const data = { heading, paragraph }
        await db.queryPromise('UPDATE teamcollaborations SET ? WHERE id = ?', [data, id])

        let latestSer = [...r, ...teamCollaborationDetails];
        //if teamCollaborationDetails is already exist then update otherwise delete and if new teamCollaborationDetails is added add it
        await Promise.all(latestSer.map(async (val, ind) => {
            if (val.id === undefined) {
                const addedSer = { 
                    website_link: val.website_link,
                    name: val.name,
                    image: val.image.filename,
                    teamCollaborationId: teamCollaborationData[0].id
                };
                await db.queryPromise('INSERT INTO teamcollaborationlogolink SET ?', addedSer);
            } else {
                if (ids.includes(val.id.toString())) {
                    let pd = null
                    await teamCollaborationDetails.map(async (v) => {
                        if(v.id !== undefined && val.id === v.id){
                            pd = v
                        }
                    });
                    const updateSer = { 
                        website_link: val.website_link,
                        name: val.name,
                        image: typeof val.image === "string" ? val.image : val.image.filename,
                     };
                    await db.queryPromise('UPDATE teamcollaborationlogolink SET ? WHERE id = ?', [updateSer, val.id]);
                } else {
                    await db.queryPromise('DELETE FROM teamcollaborationlogolink WHERE id = ?', [val.id]);
                }
            }
        }));
        
        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM teamcollaborations WHERE id = ?', [id])
        const pd = await db.queryPromise('SELECT * FROM teamcollaborationlogolink WHERE teamCollaborationId = ?', [teamCollaborationData[0].id]);
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0], teamCollaborationDetails: pd} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
