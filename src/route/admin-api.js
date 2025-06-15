import express from "express";
import adminController from "../controller/admin-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";

const adminRouter = new express.Router();

adminRouter.use(adminMiddleware);

adminRouter.delete('/logout', adminController.logout);
adminRouter.get('/current', adminController.getProfile);
adminRouter.patch('/current', adminController.updateProfile);
adminRouter.patch('/current/password', adminController.updatePassword);
adminRouter.delete('/current', adminController.deleteAdmin);

export {
    adminRouter
};