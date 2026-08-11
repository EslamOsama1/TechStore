const express = require('express')
const categoryController = require('./../controller/categoryController')
const authController = require('../controller/authController')


const categoryRouter = express.Router()



categoryRouter.route('/')
    .get(categoryController.getAllCategories)
    .post(authController.protect, authController.restrictTo('admin'), categoryController.createCategory)

categoryRouter.route('/:id')
    .get(categoryController.getCategory)
    .patch(authController.protect, authController.restrictTo('admin'), categoryController.updateCategory)
    .delete(authController.protect, authController.restrictTo('admin'), categoryController.deleteCategory)

module.exports = categoryRouter