import streamifier from "streamifier";
import ProductFamily from "../models/ProductFamily.model.js";
import cloudinary from "../utils/cloudinary.js";

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "meitu-product-families",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export const listProductFamilies = async (req, res) => {
  try {
    const families = await ProductFamily.find({ isActive: true }).sort({
      name: 1,
    });

    return res.status(200).json({
      ok: true,
      items: families,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Failed to fetch product families",
    });
  }
};

export const createProductFamily = async (req, res) => {
  try {
    const {
      code,
      name,
      category = "",
      description = "",
      copyrightText = "",
      source = "",
      notes = "",
    } = req.body || {};

    if (!code || !name) {
      return res.status(400).json({
        ok: false,
        message: "code and name are required",
      });
    }

    const exists = await ProductFamily.findOne({ code: String(code).trim() });
    if (exists) {
      return res.status(409).json({
        ok: false,
        message: "Product family with this code already exists",
      });
    }

    const family = await ProductFamily.create({
      code: String(code).trim(),
      name: String(name).trim(),
      category: String(category || "").trim(),
      description: String(description || "").trim(),
      copyrightText: String(copyrightText || "").trim(),
      meta: {
        source: String(source || "").trim(),
        notes: String(notes || "").trim(),
      },
    });

    return res.status(201).json({
      ok: true,
      item: family,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Failed to create product family",
    });
  }
};

export const uploadProductFamilyImage = async (req, res) => {
  try {
    const { familyId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Image file is required",
      });
    }

    const family = await ProductFamily.findById(familyId);
    if (!family) {
      return res.status(404).json({
        ok: false,
        message: "Product family not found",
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      public_id: `${family.code}-${Date.now()}`,
      overwrite: false,
    });

    family.images.push({
      url: result.secure_url,
      publicId: result.public_id,
      alt: family.name,
      isPrimary: family.images.length === 0,
    });

    await family.save();

    return res.status(200).json({
      ok: true,
      message: "Product family image uploaded successfully",
      images: family.images,
      item: family,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Failed to upload family image",
    });
  }
};

export const updateProductFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    const {
      name,
      category,
      description,
      copyrightText,
      isActive,
      source,
      notes,
    } = req.body || {};

    const family = await ProductFamily.findById(familyId);
    if (!family) {
      return res.status(404).json({
        ok: false,
        message: "Product family not found",
      });
    }

    if (name !== undefined) family.name = String(name || "").trim();
    if (category !== undefined) family.category = String(category || "").trim();
    if (description !== undefined)
      family.description = String(description || "").trim();
    if (copyrightText !== undefined)
      family.copyrightText = String(copyrightText || "").trim();
    if (typeof isActive === "boolean") family.isActive = isActive;

    if (source !== undefined) family.meta.source = String(source || "").trim();
    if (notes !== undefined) family.meta.notes = String(notes || "").trim();

    await family.save();

    return res.status(200).json({
      ok: true,
      item: family,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Failed to update product family",
    });
  }
};
