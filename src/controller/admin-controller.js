import adminService from "../service/admin-service.js";
import {
    updateAdminProfileValidation,
    updateAdminPasswordValidation,
    deleteAdminValidation
} from "../validation/admin-validation.js";
import { validate } from "../validation/validation.js";

const register = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await adminService.register(request);
        res.status(201).json({
            message: "Admin berhasil terdaftar",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await adminService.login(request);
        res.status(200).json({
            message: "Login berhasil",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await adminService.logout(req.admin.username);
        res.status(200).json({
            data: "Logout berhasil"
        });
    } catch (e) {
        next(e);
    }
}

const getProfile = async (req, res, next) => {
    try {
        const adminId = req.admin.id;
        const result = await adminService.getProfile(adminId);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const adminId = req.admin.id;
        const request = validate(updateAdminProfileValidation, req.body);
        const result = await adminService.updateProfile(adminId, request);
        res.status(200).json({
            message: "Profil admin berhasil diperbarui",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const adminId = req.admin.id;
        const request = validate(updateAdminPasswordValidation, req.body);
        await adminService.updatePassword(adminId, request);
        res.status(200).json({
            message: "Password admin berhasil diubah",
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
        const adminId = req.admin.id;
        const request = validate(deleteAdminValidation, req.body);
        await adminService.deleteAdmin(adminId, request.password);
        res.status(200).json({
            message: "Akun admin berhasil dihapus",
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    logout,
    getProfile, 
    updateProfile,
    updatePassword,
    deleteAdmin
}