exports.sayHello = async (req, res, next) =>{
    console.log("Landed at sayHello")
    return res.send("Heyy!!");
}