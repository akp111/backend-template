const router = require("express").Router();
const Proxy = require("../controllers/index").Proxy
router.get("/proxy", Proxy.sendWebisteContent);
router.get("/buildoor/*", Proxy.sendWebsiteAssets)
module.exports = router