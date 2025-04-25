var jwt = require('jsonwebtoken');
var UserModel = require("../models/UserModel");


const getUserInfo = async (user)=>{
	const userInfo= {
		userId:user.userId,
		loginEmail: user.loginEmail,
		loginName:user.loginName,
		loginMobile: user.loginMobile,
		role:user.role
	}
	return userInfo;
};

const createToken = async (user) => {
	let jwtSecretKey = process.env.JWT_SECRET;
	if (!jwtSecretKey) {
		console.error("JWT_SECRET is not defined in environment variables");
		throw new Error("JWT secret key is not configured");
	}
	
	const expiresIn = process.env.JWT_EXP_IN;
	console.log("Creating token with expiration:", expiresIn);
	
	try {
		const token = jwt.sign(user, jwtSecretKey, { expiresIn: expiresIn });
		return {
			token,
			expires: expiresIn,
		};
	} catch (error) {
		console.error("Token generation error:", error);
		throw error;
	}
}


const verifyjwt = async function (req, res, next) {
	try {
		let tokenHeader = req.headers['authorization'];
		if (tokenHeader) {
			let token = await tokenHeader.split(" ");
            let decoded;
            try {
                decoded = jwt.verify(token[1], process.env.JWT_SECRET);
                let userObject = await UserModel.findOne({email: decoded.loginEmail});
                if(userObject==null)
                    return res.status(401).send({ status: "Failure", error: 'Unauthorized Access.' });
            } catch (error) {
                console.log("JWT Verification Error:", error.message);
                return res.status(401).send({ status: "Failure", error: 'Invalid token: ' + error.message });
            }
			if (decoded) {
				req.user = decoded;
				let currentTime = (new Date().getTime())/1000;
				if(decoded.exp < currentTime)
					return res.status(401).send({ status: "Failure", error: 'Token Validity Expired.' });
				else    
					return next();
			}else{
				return res.status(401).send({ status: "Failure", error: 'Unauthorized Token. User Token required.' });
			}      
		}else{
			return res.status(401).send({ status: "Failure", error: "Unauthorized Token. User Token required." })
		}
	} catch (error) {
		console.log("Authorization error:", error);
		return res.status(401).send({ status: "Failure", error: 'JWT Token is expired.' })
	}
}



module.exports ={getUserInfo,createToken,verifyjwt}