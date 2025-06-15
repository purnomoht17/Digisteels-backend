import { validate } from "../validation/validation.js";
import {
  registerPelangganValidation,
  loginPelangganValidation,
  getPelangganValidation,
  updatePelangganValidation,
  updatePasswordValidation,
  deletePelangganValidation 
} from "../validation/pelanggan-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const pelanggan = validate(registerPelangganValidation, request);

  const existingPelanggan = await prismaClient.pelanggan.findUnique({
    where: {
      email: pelanggan.email
    }
  });

  if (existingPelanggan) {
    throw new ResponseError(400, "Email telah digunakan");
  }

  pelanggan.password = await bcrypt.hash(pelanggan.password, 10);

  return prismaClient.pelanggan.create({
    data: pelanggan,
    select: {
      id: true,
      nama: true,
      email: true
    }
  });
};

const login = async (request) => {
  const loginRequest = validate(loginPelangganValidation, request);

  const pelanggan = await prismaClient.pelanggan.findUnique({
    where: {
      email: loginRequest.email
    }
  });

  if (!pelanggan) {
    throw new ResponseError(401, "Email atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, pelanggan.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Email atau password salah");
  }

  const token = uuid().toString();
  await prismaClient.pelanggan.update({
    data: {
      token: token
    },
    where: {
      email: pelanggan.email
    }
  });
  
  return {
    token: token,
    nama: pelanggan.nama,
    email: pelanggan.email
  };
};

const get = async (email) => {
  const validatedEmail = validate(getPelangganValidation, email);

  const pelanggan = await prismaClient.pelanggan.findUnique({
    where: {
      email: validatedEmail
    },
    select: {
      nama: true,
      email: true
    }
  });

  if (!pelanggan) {
    throw new ResponseError(404, "Pelanggan tidak ditemukan");
  }

  return pelanggan;
}

const update = async (user, request) => {
  const updateRequest = validate(updatePelangganValidation, request);
  const dataToUpdate = {};

  if (updateRequest.email) {
    const emailExists = await prismaClient.pelanggan.count({
      where: {
        email: updateRequest.email,
        NOT: {
          email: user.email 
        }
      }
    });

    if (emailExists) {
      throw new ResponseError(400, "Email baru telah digunakan oleh pengguna lain.");
    }
    dataToUpdate.email = updateRequest.email;
  }

  if (updateRequest.nama) {
    dataToUpdate.nama = updateRequest.nama;
  }

  const updatedPelanggan = await prismaClient.pelanggan.update({
    where: {
      email: user.email 
    },
    data: dataToUpdate,
    select: {
      nama: true,
      email: true
    }
  });

  return updatedPelanggan;
}

const updatePassword = async (user, request) => {
  const updatePasswordRequest = validate(updatePasswordValidation, request);

  const pelanggan = await prismaClient.pelanggan.findUnique({
    where: {
      email: user.email
    }
  });

  if (!pelanggan) {
    throw new ResponseError(404, "Pelanggan tidak ditemukan");
  }

  const isOldPasswordValid = await bcrypt.compare(updatePasswordRequest.oldPassword, pelanggan.password);
  if (!isOldPasswordValid) {
    throw new ResponseError(400, "Password lama salah");
  }

  const newHashedPassword = await bcrypt.hash(updatePasswordRequest.newPassword, 10);

  await prismaClient.pelanggan.update({
    where: {
      email: user.email
    },
    data: {
      password: newHashedPassword
    }
  });

  return { message: "Password berhasil diperbarui" };
}

/**
 * @param {object} user
 * @param {object} request
 */
const remove = async (user, request) => {
  const deleteRequest = validate(deletePelangganValidation, request);

  const pelanggan = await prismaClient.pelanggan.findUnique({
      where: {
          email: user.email
      }
  });

  if (!pelanggan) {
      throw new ResponseError(404, "Pelanggan tidak ditemukan.");
  }

  const isPasswordValid = await bcrypt.compare(deleteRequest.password, pelanggan.password);
  if (!isPasswordValid) {
      throw new ResponseError(400, "Password salah, penghapusan akun dibatalkan.");
  }

  await prismaClient.pelanggan.delete({
      where: {
          email: user.email
      }
  });

  return { message: "Akun berhasil dihapus secara permanen." };
}

const logout = async (email) => {
  email = validate(getPelangganValidation, email);

  const pelanggan = await prismaClient.pelanggan.findUnique({
      where: {
          email: email
      }
  });

  if (!pelanggan) {
      throw new ResponseError(404, "Pelanggan tidak ditemukan");
  }

  return prismaClient.pelanggan.update({
      where: {
          email: email
      },
      data: {
          token: null
      },
      select: {
          email: true
      }
  })
}

export default {
  register,
  login,
  get,
  update,
  updatePassword,
  remove,
  logout
};