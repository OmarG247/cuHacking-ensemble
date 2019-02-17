const router = require('express').Router();
router.post('/', function (req, res) {
    const rawBodyFromClient = req.body
    console.log(JSON.stringify(rawBodyFromClient, null, 2))
    res.send()
})

module.exports = router;