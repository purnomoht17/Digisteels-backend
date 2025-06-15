import Joi from "joi";

const registerAdminValidation = Joi.object({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required()
});

const loginAdminValidation = Joi.object({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required()
});

const getAdminValidation = Joi.string().max(100).required();

const updateAdminProfileValidation = Joi.object({
  username: Joi.string().max(255).required()
});

const updateAdminPasswordValidation = Joi.object({
  oldPassword: Joi.string().max(255).required(),
  newPassword: Joi.string().max(255).required(),
});

const deleteAdminValidation = Joi.object({
  password: Joi.string().max(255).required()
});

export {
    registerAdminValidation,
    loginAdminValidation,
    getAdminValidation,
    updateAdminProfileValidation,
    updateAdminPasswordValidation,
    deleteAdminValidation
}