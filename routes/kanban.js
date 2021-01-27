var express = require('express');
var router = express.Router();
const KANBAN = require('../controllers/kanbanController');

router
    .route("/")
    .get(KANBAN.index)
    .post(KANBAN.create)
    .put(KANBAN.update)
    // .delete(KANBAN.delete)

module.exports = router;
