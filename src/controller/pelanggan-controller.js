import pelangganService from "../service/pelanggan-service.js";

const register = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await pelangganService.register(request);
        res.status(201).json({
            message: "Registrasi berhasil",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const request = req.body;
        const result = await pelangganService.login(request);
        res.status(200).json({
            message: "Login berhasil",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const email = req.pelanggan.email;
        const result = await pelangganService.get(email);
        res.status(200).json({
            message: "Data pelanggan berhasil diambil",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.pelanggan;
        const request = req.body;
        
        const result = await pelangganService.update(user, request);
        res.status(200).json({
            message: "Profil berhasil diperbarui",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const user = req.pelanggan;
        const request = req.body;

        const result = await pelangganService.updatePassword(user, request);
        res.status(200).json({
            message: result.message
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.pelanggan;
        const request = req.body;

        const result = await pelangganService.remove(user, request);
        res.status(200).json({
            message: result.message
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await pelangganService.logout(req.pelanggan.email);
        res.status(200).json({
            message: "Logout berhasil"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    get,
    update,
    updatePassword,
    remove,
    logout
}
