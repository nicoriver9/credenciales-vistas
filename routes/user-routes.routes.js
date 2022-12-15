const express = require('express');
const {isLoggedIn} = require('../lib/auth.js');
const router = express.Router();
const {    
    signin,
    credentials,
    renderRelatives,
    addRelative,
    addRelatives,
    updateRelatives,
    deleteMainUser,
    deleteRelatives
    } = require("../controllers/user-controllers")


router.get ("/",signin);

router.get ("/credentials",isLoggedIn ,credentials)

router.post ("/credentials/:isAdmin" ,credentials)

router.post('/addRelatives/:id', addRelatives );

router.get('/addRelative/:id', addRelative );

router.get('/editRelatives/:id', renderRelatives );

router.post('/updateRelatives/:relativeid/:id', updateRelatives);

router.get('/deleteMainUsers/:id', deleteMainUser);

router.get('/deleteRelatives/:relativeid/:id', deleteRelatives);

module.exports = router;

