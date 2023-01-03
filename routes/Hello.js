const router = require("express").Router();
const Hello = require("../controllers/index").Hello
router.get("/", Hello.sayHello);

module.exports = router