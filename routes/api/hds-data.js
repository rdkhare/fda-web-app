const express = require('express');
const router = express.Router();
const resultJSON = require('../../excel-convert');

// Handles all API Requests
// Can access JSON file directly by typing in the url for website followed by /api/...
// where ... can be replaced with the below routes (all-data, hds-data, cases-data, etc.)


router.get('/all-data', function (req, res) {
    res.json(resultJSON);

});



router.get('/hds-data', function(req, res) {
    res.json(resultJSON["HDS"]);
    // for (const index in resultJSON["HDS"]) {
    //     if (index != 0) {
    //         console.log(`${resultJSON["HDS"][index]["HDS_Name"]}`);
    //     }
    // }
});

// Get Single HDS object by ID

router.get('/hds-data/id=:ID', (req, res) => {
    const found = resultJSON["HDS"].some(hds => hds.ID == req.params.ID);
    if (found) {
        res.json(resultJSON["HDS"].filter(hds => hds.ID == req.params.ID));
    } else {
        res.status(400).json({msg: `No HDS with id of ${req.params.ID}`});
    }
});


router.get('/cases-data', (req, res) => res.json(resultJSON["Cases"]));
router.get('/abstracts-data', (req, res) => res.json(resultJSON["Abstract"]));

router.get('/cases-data/id=:ID', (req, res) => {
    const found = resultJSON["Cases"].some(cases => cases.ID == req.params.ID);
    if (found) {
        res.json(resultJSON["Cases"].filter(cases => cases.ID == req.params.ID));
    } else {
        res.status(400).json({msg: `No Cases with id of ${req.params.ID}`});
    }
});

router.get('/abstracts-data/id=:ID', (req, res) => {
    const found = resultJSON["Abstract"].some(abstracts => abstracts.PubMedID === parseInt(req.params.ID));
    if (found) {
        res.json(resultJSON["Abstract"].filter(abstracts => abstracts.PubMedID === parseInt(req.params.ID)));
    } else {
        res.status(400).json({msg: `No Abstracts with id of ${req.params.ID}`});
    }
});

module.exports = router;
