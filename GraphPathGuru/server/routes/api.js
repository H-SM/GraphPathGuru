// this is where we will have our api routes for the backend mongo server 

const express = require('express')
const router = express.Router()
const schema_looker = require('../schema/schema');// add on the schemas 

router.post('/', async (req, res) => {

    let feed = await schema_looker.create({
        //follow your feed with your schema in ./schema/schema.js 
    });

    res.json({feed});
})

module.exports = router;

