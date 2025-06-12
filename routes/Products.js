const express = require("express");
const Product = require("../model/Product");
const fetchUser = require("../middleware/Fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/getallproduct", fetchUser, async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery?{
      title: { $regex: req.query.searchQuery, $options: 'i' }
    }:{};
    const products = await Product.find({...searchQuery});
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

router.get("/getproduct", fetchUser, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

router.post(
  "/addproduct",
  fetchUser,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Product title should be at least 3 characters"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("description must be atleast 5 character"),
    body("price").isNumeric().withMessage("price must be a number"),
    body("instock").isNumeric().withMessage("instock must be a number"),
  ],
  async (req, res) => {
    try {
      const { title, price, description, instock,discount} = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let image = req.files.map((el)=>{
        return el.filename
      });
      
      const product = new Product({
        title,
        description,
        price,
        instock,
        image,
        discount,
        user: req.user.id,
      });
      const savedProduct = await product.save();
      res.json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put("/updateproduct/:id", fetchUser, async (req, res) => {
  const { title, price, description, instock, discount } = req.body;
  // console.log("req body", req.body);

  try {
    const newProduct = {};
    if (title) newProduct.title = title;
    if (price) newProduct.price = price;
    if (description) newProduct.description = description;
    if (instock) newProduct.instock = instock;
    if(discount !== undefined) newProduct.discount = discount;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.user || product.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You can only update your own product" });
    }
    product = await Product.findByIdAndUpdate(req.params.id, newProduct, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete product
router.delete("/deleteproduct/:id", fetchUser, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).send("unauthorized");
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;