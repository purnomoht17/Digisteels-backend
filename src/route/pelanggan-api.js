import express from "express";
import pelangganController from "../controller/pelanggan-controller.js";

import {authMiddleware} from "../middleware/auth-middleware.js";

const pelangganRouter = new express.Router();

pelangganRouter.use(authMiddleware);

pelangganRouter.get('/current', pelangganController.get);
pelangganRouter.patch('/current', pelangganController.update);
pelangganRouter.patch('/current/password', pelangganController.updatePassword);
pelangganRouter.delete('/current', pelangganController.remove);
pelangganRouter.delete('/logout', pelangganController.logout);

export {
    pelangganRouter
}