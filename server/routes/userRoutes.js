//Creating APIs
import express from 'express'
import {registerUser, loginUser, userCredits} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits',userAuth, userCredits)

export default userRouter

//localhost:4000/api/user/register OR
//localhost:4000/api/user/login OR
//localhost:4000/api/user/credits
//Depends execute which one