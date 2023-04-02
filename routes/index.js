const ProxyRoute = require("./Proxy")

function initialiseRoutes(app){

   app.use("/", ProxyRoute);
}
exports.default = initialiseRoutes;