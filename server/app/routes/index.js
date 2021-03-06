'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));

router.use('/products', require('./products'));

router.use('/orders', require('./orders'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

// router.use(function (err, req, res, next) {
//     res.status(err.status).json(err);
// });
