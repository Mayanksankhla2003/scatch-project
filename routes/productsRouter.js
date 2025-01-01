const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("working products router");
});

module.exports = router;
