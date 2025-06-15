import { validate } from "../validation/validation.js";
import {
  getAdminValidation,
  loginAdminValidation,
  registerAdminValidation,
  updateAdminProfileValidation,
  updateAdminPasswordValidation,
  deleteAdminValidation
} from "../validation/admin-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const admin = validate(registerAdminValidation, request);

  const existing = await prismaClient.admin.findUnique({
    where: {
      username: admin.username
    }
  });

  if (existing) {
    throw new ResponseError(400, "Username telah digunakan");
  }

  const hashedPassword = await bcrypt.hash(admin.password, 10);

  return prismaClient.admin.create({
    data: {
      username: admin.username,
      password: hashedPassword
    },
    select: {
      id: true,
      username: true
    }
  });
};

const login = async (request) => {
  const loginRequest = validate(loginAdminValidation, request);

  const admin = await prismaClient.admin.findUnique({
    where: {
      username: loginRequest.username
    }
  });

  if (!admin) {
    throw new ResponseError(401, "username atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, admin.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "username atau password salah");
  }

  const token = uuid().toString();
  const updated = await prismaClient.admin.update({
    data: {
      token
    },
    where: {
      username: admin.username
    },
    select: {
      token: true
    }
  });

  return {
    token: updated.token,
    nama: admin.username, 
    username: admin.username
  };

};

const logout = async (username) => {
  username = validate(getAdminValidation, username);

  const admin = await prismaClient.admin.findUnique({
    where: {
      username: username
    }
  });

  if (!admin) {
    throw new ResponseError(404, "Admin tidak ditemukan");
  }

  return prismaClient.admin.update({
    where: {
      username: username
    },
    data: {
      token: null
    },
    select: {
      username: true
    }
  });
};

const getProfile = async (adminId) => {
  const admin = await prismaClient.admin.findUnique({
    where: {
      id: adminId
    },
    select: {
      id: true,
      username: true,
    }
  });

  if (!admin) {
    throw new ResponseError(404, "Admin tidak ditemukan");
  }

  return admin;
};

const updateProfile = async (adminId, request) => {
  const profileRequest = validate(updateAdminProfileValidation, request);

  const existingAdmin = await prismaClient.admin.findUnique({
    where: {
      username: profileRequest.username
    }
  });

  if (existingAdmin && existingAdmin.id !== adminId) {
    throw new ResponseError(400, "Username telah digunakan oleh admin lain.");
  }

  const updatedAdmin = await prismaClient.admin.update({
    where: {
      id: adminId
    },
    data: {
      username: profileRequest.username
    },
    select: {
      id: true,
      username: true
    }
  });

  if (!updatedAdmin) {
    throw new ResponseError(500, "Gagal memperbarui profil admin.");
  }

  return updatedAdmin;
};

const updatePassword = async (adminId, request) => {
  const passwordRequest = validate(updateAdminPasswordValidation, request);

  const admin = await prismaClient.admin.findUnique({
    where: {
      id: adminId
    }
  });

  if (!admin) {
    throw new ResponseError(404, "Admin tidak ditemukan.");
  }

  const isOldPasswordValid = await bcrypt.compare(passwordRequest.oldPassword, admin.password);
  if (!isOldPasswordValid) {
    throw new ResponseError(401, "Password lama salah.");
  }

  const hashedNewPassword = await bcrypt.hash(passwordRequest.newPassword, 10);

  const updatedAdmin = await prismaClient.admin.update({
    where: {
      id: adminId
    },
    data: {
      password: hashedNewPassword
    },
    select: {
      id: true,
      username: true
    }
  });

  if (!updatedAdmin) {
    throw new ResponseError(500, "Gagal memperbarui password admin.");
  }

  return updatedAdmin;
};

const deleteAdmin = async (adminId, passwordConfirmation) => {
  const admin = await prismaClient.admin.findUnique({
    where: {
      id: adminId
    }
  })

  if (!admin) {
    throw new ResponseError(404, "Admin tidak ditemukan.");
  }

  const isPasswordValid = await bcrypt.compare(passwordConfirmation, admin.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Password konfirmasi salah.");
  }

  await prismaClient.admin.delete({
    where: {
      id: adminId
    }
  });

  return "Admin account deleted successfully.";
};


export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword,
  deleteAdmin
};