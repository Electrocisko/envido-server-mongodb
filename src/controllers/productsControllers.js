import { Product } from "../models/productModel.js";
import mongoose from "mongoose";
import fs from "fs";
import dayjs from "dayjs";

export const getProducts = async (req, res) => {
  try {
    const data = await Product.find().sort({nostock: 1, iat: -1}).lean()
    res.status(200).json({
      status: "success",
      category: "productos",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en obtener productos",
    });
  }
};

export const getProductsCat = async (req, res) => {
  try {
    let param = req.params;
    const data = await Product.find({ categoria: param.cat }).sort({onstock:1, iat: -1}).lean();
    res.status(200).json({
      status: "success",
      category: param.cat,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en mostrar productos por categoria",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let newProduct = req.body;
    const { modelo, categoria, precio } = newProduct;
    if (req.file) {
      newProduct.image = req.file.filename;
      const imageSplit = req.file.filename.split(".");
      const extension = imageSplit[1];
      if (extension != "png" && extension != "jpg" && extension != "webp") {
        throw new Error("Archivo adjunto no valido.");
      }
      if (req.file.size > 300000)
        throw new Error("El archivo no puede superar 300Kb");
    } else {
      newProduct.image = "logo-envido.png";
    }
    if (!modelo || categoria == "Seleccione categoría" || !precio) {
      throw new Error("Falta datos");
    }
    let product = new Product(newProduct);
    product.iat = dayjs().format('DD/MM/YYYY, HH:mm');

    let data = await product.save();
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    if (req.file) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Id  no valido");
    let result = await Product.findByIdAndDelete(id);
    // Borro el archivo
    if (result.image !== "logo-envido.png") {
      fs.unlinkSync(`src/public/images/${result.image}`);
    }
    if (result == null) throw new Error("No se encontro producto con ese Id");
    res.status(200).json({
      status: "success",
      message: "Producto eliminado ",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en borrar producto por su Id",
      error: error.message,
    });
  }
};

export const modifiedProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Id  no valido");
    let data = req.body;
    if (req.file) {
      const oldData = await Product.findById(id);
      //Borro la imagen anterior
      if (oldData.image !== "logo-envido.png") {
        fs.unlinkSync(`src/public/images/${oldData.image}`);
      }
      data.image = req.file.filename;
      const imageSplit = req.file.filename.split(".");
      const extension = imageSplit[1];
      if (extension != "png" && extension != "jpg" && extension != "webp") {
        throw new Error("Archivo adjunto no valido.");
      }
      if (req.file.size > 300000) {
        throw new Error("El archivo no puede superar 300Kb");
      }
    }
    data.iat = dayjs().format('DD/MM/YYYY, HH:mm');

    //Modifica imagen si es que hay
    let modifiedProduct = await Product.findByIdAndUpdate(id, data);
  

    res.status(200).json({
      status: "success",
      message: "Producto Modificado ",
      modifiedProduct,
    });
  } catch (error) {
    if (req.file) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
    }
    res.status(500).json({
      status: "error",
      message: "Error en modificar producto por su Id",
      error: error.message,
    });
  }
};
