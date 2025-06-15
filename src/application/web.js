import express from "express";
import cors from "cors";

import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { pelangganRouter } from "../route/pelanggan-api.js";
import { adminRouter } from "../route/admin-api.js";
import { router as produkRouter } from "../route/produk-api.js";
import { router as keranjangRouter } from "../route/keranjangBelanja-api.js";
import { router as pesananRouter } from "../route/pesanan-api.js";
import { router as pembatalanRouter } from "../route/pembatalan-api.js";
import { router as laporanRouter } from "../route/laporan-api.js";
import uploadRouter from "../route/upload-api.js";
import { uploadProdukRouter } from "../route/upload-produk-api.js";

export const web = express();

web.use(cors({
  origin: [
    "http://localhost:3000",
    "https://digisteels-fo1y.vercel.app",
    "https://uas-software-development-kelompok7.vercel.app",
    "https://digisteels.com",
    "https://www.digisteels.com"
  ],
  credentials: true
}));

web.use(express.json());

web.use(publicRouter);

web.use("/api/admin", adminRouter);
web.use("/api/pelanggan", pelangganRouter);
web.use("/api/produk", produkRouter);
web.use("/api/keranjang", keranjangRouter);
web.use("/api/pesanan", pesananRouter);
web.use("/api/pembatalan", pembatalanRouter);
web.use("/api/laporan", laporanRouter);
web.use('/api', uploadRouter);
web.use('/api', uploadProdukRouter);


// Proxy API Wilayah Indonesia
web.get("/api/proxy/provinces", async (req, res, next) => {
  try {
    const response = await fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
    const data = await response.json();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

web.get("/api/proxy/regencies/:provinceId", async (req, res, next) => {
  try {
    const { provinceId } = req.params;
    const response = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

web.get("/api/proxy/districts/:regencyId", async (req, res, next) => {
  try {
    const { regencyId } = req.params;
    const response = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${regencyId}.json`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    next(e);
  }
});

web.get("/api/proxy/villages/:districtId", async (req, res, next) => {
  try {
    const { districtId } = req.params;
    const response = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/villages/${districtId}.json`);
    const data = await response.json();
    res.json(data);
  } catch(e) {
    next(e);
  }
});

web.use(errorMiddleware);