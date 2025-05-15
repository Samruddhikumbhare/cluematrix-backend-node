const db = require("../models/dbConnection");

//get product
exports.getProducts = async(req, res) => {
    try {
        // Query the database to retrieve all data
        let results = await db.queryPromise('SELECT * FROM product')
        for(let i=0; i < results.length; i++) {
            let img = await db.queryPromise('SELECT image FROM productimage WHERE productId = ?', [results[i].id])
            let im = img.map((val) => {
                return val.image
            })
            results[i] = {
                ...results[i], 
                description: await db.queryPromise('SELECT * FROM productdescription WHERE productId = ?', [results[i].id]),
                images: im,
                productBenifits: await db.queryPromise('SELECT * FROM productbenefits WHERE productId = ?', [results[i].id])
            }

        }
        res.status(200).json({ message: 'Data retrieved successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// add product
exports.addProducts = async (req, res) => {
    let { name, description, productBenifits, clientUrl } = req.body;
    try {
        // product insert
        let addProduct = {name, clientUrl, active:true}
        const product = await db.queryPromise('INSERT INTO product SET ?', [addProduct])

        //add all image
        await req.files.images.forEach(async (item) => {
            const productImage = { image: item.filename, productId: product.insertId }
            await db.queryPromise('INSERT INTO productimage SET ?', productImage);
        }) 

        //add all description
        await JSON.parse(description).forEach(async (item) => {
            const desc = { des: item.des, productId: product.insertId }
            await db.queryPromise('INSERT INTO productdescription SET ?', desc);
        }) 

        //add all productBenifits
        await JSON.parse(productBenifits).forEach(async (item) => {
            const ben = { heading: item.heading, description: item.description, productId: product.insertId }
            await db.queryPromise('INSERT INTO productbenefits SET ?', ben);
        }) 

        const resp = await db.queryPromise('SELECT * FROM product WHERE id = ?', [product.insertId])
        for(let i=0; i < resp.length; i++) {
            let img = await db.queryPromise('SELECT image FROM productimage WHERE productId = ?', [resp[i].id])
            let im = img.map((val) => {
                return val.image
            })
            resp[i] = {
                ...resp[i], 
                description: await db.queryPromise('SELECT * FROM productdescription WHERE productId = ?', [resp[i].id]),
                images: im,
                productBenifits: await db.queryPromise('SELECT * FROM productbenefits WHERE productId = ?', [resp[i].id])
            }
        }

        res.status(200).json({ message: 'Data added successfully', data: resp[0] });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// edit product
exports.editProducts = async (req, res) => {
    let { name, description, productBenifits, clientUrl, id } = req.body;
    try {

        // Check if the id exists in the product table
        const product = await db.queryPromise('SELECT * FROM product WHERE id = ?', [id])

        // Check if the product with the given productId exists
        if (product.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        if (req.files.images !== undefined) {
            //delete all existing image
            await db.queryPromise('DELETE FROM productimage WHERE productId = ?', [id]);

            //add all image
            await req.files.images.forEach(async (item) => {
                const productImage = { image: item.filename, productId: id }
                await db.queryPromise('INSERT INTO productimage SET ?', productImage);
            }) 
        }

        //get the product details
        const proDes = await db.queryPromise('SELECT * FROM productdescription WHERE productId = ?', [id])
        const proBen = await db.queryPromise('SELECT * FROM productbenefits WHERE productId = ?', [id])

        //store all update proDes ids which proDes is already exist
        const proDesids = []
        JSON.parse(description).forEach((val) => {
            if(val.id !== undefined) {
                proDesids.push(val.id.toString())
            }
        })

        //store all update proBen ids which proBen is already exist
        const proBenids = []
        JSON.parse(productBenifits).forEach((val) => {
            if(val.id !== undefined) {
                proBenids.push(val.id.toString())
            }
        })
        
        // If both id and data are valid, update the product
        const data = { name, clientUrl }
        await db.queryPromise('UPDATE product SET ? WHERE id = ?', [data, id])

        let latestproDes = [...proDes, ...JSON.parse(description)];
        //if description is already exist then update otherwise delete and if new description is added add it
        await Promise.all(latestproDes.map(async (val, ind) => {
            if (val.id === undefined) {
                const addedproDes = { 
                    des: val.des,
                    productId: id
                };
                await db.queryPromise('INSERT INTO productdescription SET ?', addedproDes);
            } else {
                if (proDesids.includes(val.id.toString())) {
                    let pd = null
                    await JSON.parse(description).map(async (v) => {
                        if(v.id !== undefined && val.id === v.id){
                            pd = v
                        }
                    });
                    const updateproDes = { 
                        des: pd.des,
                     };
                    await db.queryPromise('UPDATE productdescription SET ? WHERE id = ?', [updateproDes, val.id]);
                } else {
                    await db.queryPromise('DELETE FROM productdescription WHERE id = ?', [val.id]);
                }
            }
        }));

        let latestproBen = [...proBen, ...JSON.parse(productBenifits)];
        //if description is already exist then update otherwise delete and if new description is added add it
        await Promise.all(latestproBen.map(async (val, ind) => {
            if (val.id === undefined) {
                const addedproBen = { 
                    heading: val.heading,
                    description: val.description,
                    productId: id
                };
                await db.queryPromise('INSERT INTO productbenefits SET ?', addedproBen);
            } else {
                if (proBenids.includes(val.id.toString())) {
                    let pd = null
                    await JSON.parse(productBenifits).map(async (v) => {
                        if(v.id !== undefined && val.id === v.id){
                            pd = v
                        }
                    });
                    const updateproBen = { 
                        heading: pd.heading,
                        description: pd.description,
                     };
                    await db.queryPromise('UPDATE productbenefits SET ? WHERE id = ?', [updateproBen, val.id]);
                } else {
                    await db.queryPromise('DELETE FROM productbenefits WHERE id = ?', [val.id]);
                }
            }
        }));
        
        // Fetch the updated data after all operations are complete
        const resp = await db.queryPromise('SELECT * FROM product WHERE id = ?', [id])
        for(let i=0; i < resp.length; i++) {
            let img = await db.queryPromise('SELECT image FROM productimage WHERE productId = ?', [resp[i].id])
            let im = img.map((val) => {
                return val.image
            })
            resp[i] = {
                ...resp[i], 
                description: await db.queryPromise('SELECT * FROM productdescription WHERE productId = ?', [resp[i].id]),
                images: im,
                productBenifits: await db.queryPromise('SELECT * FROM productbenefits WHERE productId = ?', [resp[i].id])
            }
        }

        res.status(200).json({ message: 'Data updated successfully', data: resp[0] });                    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete product
exports.deleteProducts = async(req, res) => {
    let { id } = req.body;
    try {

        // Check if the id exists in the product table
        const product = await db.queryPromise('SELECT * FROM product WHERE id = ?', [id])

        // Check if the product with the given productId exists
        if (product.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }

        await db.queryPromise('DELETE FROM productdescription WHERE productId = ?', [id]);
        await db.queryPromise('DELETE FROM productimage WHERE productId = ?', [id]);
        await db.queryPromise('DELETE FROM productbenefits WHERE productId = ?', [id]);
        await db.queryPromise('DELETE FROM product WHERE id = ?', [id]);

        // Query the database to retrieve all data
        let results = await db.queryPromise('SELECT * FROM product')
        for(let i=0; i < results.length; i++) {
            let img = await db.queryPromise('SELECT image FROM productimage WHERE productId = ?', [results[i].id])
            let im = img.map((val) => {
                return val.image
            })
            results[i] = {
                ...results[i], 
                description: await db.queryPromise('SELECT * FROM productdescription WHERE productId = ?', [results[i].id]),
                images: im,
                productBenifits: await db.queryPromise('SELECT * FROM productbenefits WHERE productId = ?', [results[i].id])
            }

        }
        res.status(200).json({ message: 'Data deleted successfully', data: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//status product
exports.statusProducts = async(req, res) => {
    let { id } = req.body;
    try {

        // Check if the id exists in the product table
        const product = await db.queryPromise('SELECT * FROM product WHERE id = ?', [id])

        // Check if the product with the given productId exists
        if (product.length === 0) {
            res.status(400).json({ message: 'Data not found' });
            return;
        }
        const updatep = { 
            name: product[0].name,
            clientUrl: product[0].clientUrl,
            active: !product[0].active
         };
        await db.queryPromise('UPDATE product SET ? WHERE id = ?', [updatep, id]);

        // Query the database to retrieve all data
        let results = await db.queryPromise('SELECT * FROM product')
        for(let i=0; i < results.length; i++) {
            let img = await db.queryPromise('SELECT image FROM productimage WHERE productId = ?', [results[i].id])
            let im = img.map((val) => {
                return val.image
            })
            results[i] = {
                ...results[i], 
                description: await db.queryPromise('SELECT * FROM productdescription WHERE productId = ?', [results[i].id]),
                images: im,
                productBenifits: await db.queryPromise('SELECT * FROM productbenefits WHERE productId = ?', [results[i].id])
            }

        }
        res.status(200).json({ message: 'Status change successfully', data: results });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
}
