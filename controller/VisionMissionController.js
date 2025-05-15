const db = require("../models/dbConnection");

//get Vision Mission
exports.getVisionMission = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM visionmission')
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0]} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//add Vision Mission
exports.createVisionMission = async (req, res) => {
    const { heading, vision, mission } = req.body;

    try {
        // Check if an image file was uploaded
        if (!req.files.image) {
            return res.status(400).json({ message: "Please upload a image." });
        }

        //data which is add on visionmission table
        const data = { heading, image: req.files.image[0].filename, vision, mission }

        // Query the database to add the data in table
        const resultsVisionMission = await db.queryPromise('INSERT INTO visionmission SET ?', data)

        res.json({ data: {id: resultsVisionMission.insertId, heading, image: req.files.image[0].filename, vision, mission},  message: "Your data has been succesfully submitted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


// edit Vision Mission
exports.editVisionMission = async (req, res) => {
    const { heading, image, vision, mission, id } = req.body;

    try {

        // Check if the visionmissionId exists in the visionmission table
        const visionmissionResults = await db.queryPromise('SELECT * FROM visionmission WHERE id = ?', [id])
        // Check if the visionmission with the given visionmissionId exists
        if (visionmissionResults.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }
        
        // If both id and data are valid, update the visionmission
        const data = { 
            heading, 
            image: image === undefined ? req.files.image[0].filename : image, 
            vision, mission
        }
        await db.queryPromise('UPDATE visionmission SET ? WHERE id = ?', [data, id])

        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM visionmission WHERE id = ?', [id])
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0]} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
