var jwt = require ("jsonwebtoken")
const secret = process.env.SECRET;


const fetchUser =  async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({message:"Please authenticate."});
    }
    try {
        const data = jwt.verify(token, secret);
        req.user = data.user;
        next();
        } catch (error) {
            res.status(400).send({ message: "Invalid token" });
        }
};
 module.exports = fetchUser;