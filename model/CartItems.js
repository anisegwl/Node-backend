const mongoose = require('mongoose');
const { schema } = mongoose;
const cartSchema = new schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: [String],
        required:false,
    }
});

const cartItems = mongoose.model("CartItems", cartSchema);
module.exports = cartItems;