const express = require('express');
const { body, validationResult } = require('express-validator'); 
const Product = require('../model/Product');
const fetchUser = require("../middleware/Fetchuser");

const router = express.Router();

// This will show all product with authentication only
router.get("/getallproduct",fetchUser , async (req,res)=>{
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).send ("internal server error");
  }
})

// This will show product added by specific user only
router.get("/getproduct",fetchUser , async (req,res)=>{
  try {
    const products = await Product.find({user: req.user.id});
    res.json(products);
  } catch (error) {
    res.status(500).send ("internal server error");
  }
})

router.post(
  "/addproduct",
  fetchUser,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long"),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("inStock")
      .isNumeric()
      .withMessage("InStock must be numeric"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, price, description, inStock } = req.body;
      const product = new Product({
        title,
        price,
        description,
        inStock,
        user: req.user._id,
      });

      const saveProduct = await product.save();
      res.json(saveProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put("/updateproduct/:id", fetchUser, async(req,res)=>{
    const {title, price, description,inStock} = req.body;
    console.log("req body" , req.body);

    try {
      const newProduct = {}
      if(title) newProduct.title = title;
      if(price) newProduct.price = price;
      if(description)  newProduct.description = description;
      if(inStock) newProduct.inStock = inStock;

      let product = await Product.findByIdAndUpdate(req.params.id)
      if(!product) {
        return res.status(404).json({message : "Product Not Found"})
      }
      // unauthenticated
      if(!product.user || product.user.toString() !== req.user.id) {
          return res.status(401).json({message : "You cannot update other product"})
      }
      product = await Product.findById(req.params.id, newProduct,{
        new : true
      }) 
    } catch (error) {
      
    }
})

module.exports = router;
