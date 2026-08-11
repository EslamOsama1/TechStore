const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authController')


let userRouter = express.Router()

// Public routes
userRouter.post('/signup', authController.signup)
userRouter.post('/login', authController.login)
userRouter.post('/forgotPassword', authController.forgotPassword)
userRouter.patch('/resetPassword/:token', authController.resetPassword)

// Protected routes 
userRouter.use(authController.protect);

userRouter.patch('/updateMyPassword', authController.updatePassword)
userRouter.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe)
userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.get('/me', userController.getMe, userController.getUser);


// Admin routes
userRouter.use(authController.restrictTo("admin"));

userRouter.route('/')
    .get(userController.getAllUsers)

userRouter.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)


module.exports = userRouter