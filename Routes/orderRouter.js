const express = require("express");

const authController = require("../controller/authController");
const orderController = require("../controller/orderController");

const orderRouter = express.Router();

orderRouter.post("/webhook-checkout", orderController.webhookCheckout);

orderRouter.use(authController.protect);

orderRouter.route('/')
    .get(orderController.getLoggedUserOrders)

orderRouter.get("/all", authController.restrictTo("admin"), orderController.getAllOrders);

orderRouter.route('/:cartId')
    .post(orderController.createCashOrder);

orderRouter.route('/:cartId/card')
    .post(orderController.createCardOrder);

module.exports = orderRouter;