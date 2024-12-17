import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async (req,res)=>{
    try{
        const {name, email, password} = req.body;
        if (!name || !email || !password){
            return res.json({success:false, message: 'Missing details!'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt) //hash and encryption process
        
        const userData = {   //new user object to be saved to database
            name, 
            email, 
            password: hashedPassword
        }

        const newUser = new userModel(userData) //from userModel.js
        const user = await newUser.save() //save new user to database 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET) //one unique id / token generated for each user

        res.json({success:true, token, user: {name: user.name}}) //send name property back
    } catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }

}

const loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body; //from front-end body input
        const user = await userModel.findOne({email}) //search from database

        if (!user){
            return res.json({success:false, message:'User does not exist!'})
        }

        const isMatch = await bcrypt.compare(password, user.password) //compare with stored password
        if (isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success:true, token, user: {name: user.name}})
        }else{
            return res.json({success:false, message:'Wrong password!'})
        }
    } catch(error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const userCredits = async (req,res)=>{
    try {
        const {userId} = req.body;

        const user= await userModel.findById(userId)
        res.json({success:true, credits: user.creditBalance,
            user: {name: user.name}
        })
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export {registerUser, loginUser, userCredits}