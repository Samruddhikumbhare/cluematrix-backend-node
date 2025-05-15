const db = require("../models/dbConnection");

//get Journey
exports.getJourney = async(req, res) => {
    try {
        // Query the database to retrieve all data
        const results = await db.queryPromise('SELECT * FROM journey')
        const j = await db.queryPromise('SELECT * FROM journeydetail WHERE journeyId = ?', [results[0].id])
        res.status(200).json({ message: 'Data retrieved successfully', data: {...results[0], journey: j} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit journey
exports.editJourney = async (req, res) => {
    const { heading, journey, id } = req.body;

    try {

        // Check if the journeyId exists in the journey table
        const Results = await db.queryPromise('SELECT * FROM journey WHERE id = ?', [id])
        // Check if the journey with the given journeyId exists
        if (Results.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        //update journey detail
        const data = {heading}
        await db.queryPromise('UPDATE journey SET ? WHERE id = ?', [data, id]);

        await Promise.all(journey.map(async (val) => {
            const updateJor = { journey_name: val.journey_name, journey_description: val.journey_description, journeyId: id };
            await db.queryPromise('UPDATE journeydetail SET ? WHERE id = ?', [updateJor, val.id]);
        }));

        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM journey WHERE id = ?', [id])
        const j = await db.queryPromise('SELECT * FROM journeydetail WHERE journeyId = ?', [id]);
        res.status(200).json({ message: 'Data updated successfully', data: {...resp[0], journey: j} });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
