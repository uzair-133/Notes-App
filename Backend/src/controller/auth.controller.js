const userModel = require('../model/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const registerUser = async (req, res) => {
    try {

        const { username, email, password } = req.body;
        const isExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if (isExist) {
            return res.status(409).json({
                message: "user already exist"
            })
        }
        const hashedPAssword = await bcrypt.hash(password, 10);
        const userC = await userModel.create({
            username,
            email,
            password: hashedPAssword,
        })
       
        const token = jwt.sign({
            id: userC._id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token)

        res.status(201).json({
            message: "user created successfully",
            userC: {
                id: userC._id,
                username: userC.username,
                email: userC.email,
            }
        })

    }
    catch (err) {
        res.status(500).json({
            message: "internal server error",
            err
        })
    }


}

const loginUser = async (req, res) => {

    try {
        const {username, email, password } = req.body;
        const user = await userModel.findOne({
           $or:[
            {username},
            {email}
           ]
        })
        if (!user) {
            return res.status(401).json({
                message: "user not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "password is incorrect"
            })
        }
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        })
        res.cookie('token', token)

        res.status(200).json({
            message: "LOgin Successfully",
            user:{
                id: user._id,
                username: user.username,
            }
        })
    } catch (err) {
        res.status(500).json({
            message:"internal server error",
            err
        })

    }

}


module.exports = {
    registerUser,
    loginUser
 }