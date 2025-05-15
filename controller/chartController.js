const db = require("../models/dbConnection");

// get the year and provide data acccoring to year and month
exports.getYear = async (req, res) => {
    const { year } = req.body;

    try {
        // get the data from usercontact according to year
        const userContact = await db.queryPromise('SELECT * FROM usercontact WHERE YEAR(created_at) = ?', [year])

        // get the data from newsletter according to year
        const newsletter = await db.queryPromise('SELECT * FROM newsletter WHERE YEAR(created_at) = ?', [year])

        // get the data from scheduledemo according to year
        const scheduleDemo = await db.queryPromise('SELECT * FROM scheduledemo WHERE YEAR(created_at) = ?', [year])

        const data = [
            {
              "name": "Jan",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Feb",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Mar",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Apr",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "May",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "June",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "July",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Aug",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Sep",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Oct",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Nov",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
            {
              "name": "Dec",
              "Contacted Person": 0,
              "Subscribe Newsletter": 0,
              "Schedule Demo": 0,
            },
          ]

        await userContact.map(async (val) => {
            if (val.created_at.getMonth() === 0) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 1) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 2) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 3) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 4) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 5) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 6) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 7) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 8) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 9) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 10) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
            if (val.created_at.getMonth() === 11) {
                data[val.created_at.getMonth()]["Contacted Person"] = data[val.created_at.getMonth()]["Contacted Person"] + 1
            }
        })

        await scheduleDemo.map(async (val) => {
            if (val.created_at.getMonth() === 0) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 1) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 2) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 3) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 4) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 5) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 6) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 7) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 8) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 9) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 10) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
            if (val.created_at.getMonth() === 11) {
                data[val.created_at.getMonth()]["Schedule Demo"] = data[val.created_at.getMonth()]["Schedule Demo"] + 1
            }
        })

        await newsletter.map(async (val) => {
            if (val.created_at.getMonth() === 0) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 1) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 2) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 3) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 4) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 5) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 6) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 7) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 8) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 9) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 10) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
            if (val.created_at.getMonth() === 11) {
                data[val.created_at.getMonth()]["Subscribe Newsletter"] = data[val.created_at.getMonth()]["Subscribe Newsletter"] + 1
            }
        })

        res.status(200).json({ message: 'Data retrived successfully', data });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
