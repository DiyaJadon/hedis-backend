import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

/* ====================================
   FIX __dirname FOR ES MODULES
==================================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ====================================
   LOAD PRODUCTS DATABASE
==================================== */

const productsPath = path.join(__dirname, "../data/products.json");

let products = [];

try {
  const data = fs.readFileSync(productsPath, "utf-8");
  products = JSON.parse(data);
} catch (error) {
  console.error("Error loading products database:", error);
}

/* ====================================
   HELPER FUNCTION (SAFE NORMALIZE)
==================================== */

const normalize = (value) => {
  if (!value) return "";
  return value.toLowerCase().trim();
};

/* ====================================
   GET ALL PRODUCTS + FILTER
==================================== */

router.get("/", (req, res) => {
  try {
    let { category } = req.query;

    if (category) {
      category = normalize(decodeURIComponent(category));

      const filteredProducts = products.filter((product) =>
        normalize(product.maincategory) === category
      );

      return res.json(filteredProducts);
    }

    res.json(products);
  } catch (error) {
    console.error("Error in GET /products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================
   GET PRODUCT BY ID
==================================== */

router.get("/id/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in GET /id:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================
   GET PRODUCTS BY CATEGORY (URL PARAM)
==================================== */

router.get("/category/:category", (req, res) => {
  try {
    const category = normalize(
      decodeURIComponent(req.params.category)
    );

    const filteredProducts = products.filter((product) =>
      normalize(product.maincategory) === category
    );

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error in GET /category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================
   SEARCH PRODUCTS
==================================== */

router.get("/search", (req, res) => {
  try {
    const query = req.query.name;

    if (!query) return res.json([]);

    const search = normalize(query);

    const results = products.filter(
      (product) =>
        product.name &&
        product.name.toLowerCase().includes(search)
    );

    res.json(results);
  } catch (error) {
    console.error("Error in SEARCH:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ====================================
   GET ALL CATEGORIES
==================================== */

router.get("/categories", (req, res) => {
  try {
    const categories = [
      ...new Set(
        products
          .filter((p) => p.maincategory)
          .map((p) => p.maincategory)
      ),
    ];

    res.json(categories);
  } catch (error) {
    console.error("Error in GET /categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;