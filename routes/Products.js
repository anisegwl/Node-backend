const express = require("express");
const Product = require("../model/Product");
const fetchUser = require("../middleware/Fetchuser");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// @route    GET /api/products/getallproduct
// @desc     Get all products (with optional search & category filtering)
// @access   Private
router.get("/getallproduct", fetchUser, async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery
      ? { title: { $regex: req.query.searchQuery, $options: "i" } }
      : {};

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const products = await Product.find({ ...searchQuery, ...categoryFilter });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// @route    GET /api/products/getproduct
// @desc     Get products added by the logged-in user
// @access   Private
router.get("/getproduct", fetchUser, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// @route    POST /api/products/addproduct
// @desc     Add a new product

router.post(
  "/addproduct",
  fetchUser,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Product title should be at least 3 characters"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("instock").isNumeric().withMessage("Stock must be a number"),
    body("category")
      .isIn(["Men", "Women"])
      .withMessage("Category must be either 'Men' or 'Women'"),
  ],
  async (req, res) => {
    try {
      const { title, price, description, instock, discount, category } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extract filenames from uploaded images
      let image = req.files?.map((el) => el.filename) || [];

      const product = new Product({
        title,
        description,
        price,
        instock,
        image,
        discount,
        category,
        user: req.user.id,
      });

      const savedProduct = await product.save();
      res.json(savedProduct);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// @route    PUT /api/products/updateproduct/:id
// @desc     Update an existing product
// @access   Private
router.put("/updateproduct/:id", fetchUser, async (req, res) => {
  const { title, price, description, instock, discount, category } = req.body;

  try {
    const newProduct = {};
    if (title) newProduct.title = title;
    if (price) newProduct.price = price;
    if (description) newProduct.description = description;
    if (instock) newProduct.instock = instock;
    if (discount !== undefined) newProduct.discount = discount;
    if (category) newProduct.category = category;

    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure the logged-in user owns the product
    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "You can only update your own product" });
    }

    product = await Product.findByIdAndUpdate(req.params.id, newProduct, { new: true });
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route    DELETE /api/products/deleteproduct/:id
// @desc     Delete a product
// @access   Private
router.delete("/deleteproduct/:id", fetchUser, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure the logged-in user owns the product
    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).send("Unauthorized");
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
