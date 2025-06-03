const express = require('express');
const Product = require('../model/Product');
const fetchUser = require("../middleware/Fetchuser");
const router = express.Router()


router.post("/addproduct", fetchUser , async (req, res) => {
    try {
     const {title, price, description, inStock} = req.body;
     const product = new Product({
        title ,
        price,
        description,
        inStock,
        user: req.user._id
        });
       const saveProduct = await product.save();
       res.json(saveProduct);
    } catch (error) {
      res.status(500).json({message : error.message })
    }
})

module.exports = router;
