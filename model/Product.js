const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
   user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inStock: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Product = mongoose.model("Product", productSchema);
module.exports = Product;