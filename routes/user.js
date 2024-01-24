const express = require('express');
const router = express.Router();
const userService = require('../services/user');

/* GET user listing. */

router.get('/:id_user', async function(req, res, next) {
    try {
        res.json(await userService.getUser(req.params.id_user));
    } catch (err) {
        console.error(`Error while getting user `, err.message);
        next(err);
    }
    }
);

module.exports = router;