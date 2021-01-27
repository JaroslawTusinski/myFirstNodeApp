var express = require('express');
var router = express.Router();

const MAIN = require('../controllers/mainController');

router
    .route("/")
    .get(MAIN.index)
    .post(MAIN.login)

module.exports = router;