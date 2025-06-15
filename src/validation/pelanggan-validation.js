import Joi from "joi";

const registerPelangganValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': "email harus berupa string",
            'string.email': "email harus dalam format yang valid",
            'any.required': "email wajib diisi",
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|<>?;:,.~]*$'))
        .messages({
            'string.base': "password harus berupa string",
            'string.min': "password minimal 8 karakter",
            'string.max': "password maksimal 100 karakter",
            'string.pattern.base': "password hanya boleh mengandung huruf, angka, dan karakter khusus",
            'any.required': "password wajib diisi",
        }),

    nama: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': "nama harus berupa string",
            'string.max': "nama maksimal 100 karakter",
            'any.required': "nama wajib diisi",
        })
});

const loginPelangganValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': "email harus berupa string",
            'string.email': "email harus dalam format yang valid",
            'any.required': "email wajib diisi",
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
        .messages({
            'string.base': "password harus berupa string",
            'string.min': "password minimal 8 karakter",
            'string.max': "password maksimal 100 karakter",
            'any.required': "password wajib diisi",
        })
});

const getPelangganValidation = Joi.string().max(100).required();

const updatePelangganValidation = Joi.object({
    nama: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.base': "nama harus berupa string",
            'string.max': "nama maksimal 100 karakter",
        }),
    email: Joi.string()
        .email()
        .max(100)
        .optional()
        .messages({
            'string.base': "email harus berupa string",
            'string.email': "email harus dalam format yang valid",
            'string.max': "email maksimal 100 karakter",
        })
});

const updatePasswordValidation = Joi.object({
    oldPassword: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': "Password lama harus berupa string",
            'string.max': "Password lama maksimal 100 karakter",
            'any.required': "Password lama wajib diisi",
        }),
    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required()
        .invalid(Joi.ref('oldPassword'))
        .messages({
            'string.base': "Password baru harus berupa string",
            'string.min': "Password baru minimal 8 karakter",
            'string.max': "Password baru maksimal 100 karakter",
            'any.required': "Password baru wajib diisi",
            'any.invalid': "Password baru tidak boleh sama dengan password lama",
        })
});

const deletePelangganValidation = Joi.object({
    password: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': "Password konfirmasi harus berupa string",
            'string.max': "Password konfirmasi maksimal 100 karakter",
            'any.required': "Password konfirmasi wajib diisi untuk menghapus akun",
        })
});


export {
    registerPelangganValidation,
    loginPelangganValidation,
    getPelangganValidation,
    updatePelangganValidation,
    updatePasswordValidation,
    deletePelangganValidation
};