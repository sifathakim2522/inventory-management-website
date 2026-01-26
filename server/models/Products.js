import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // Link to Category Model
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    // Link to Supplier Model
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("Product", productSchema);
export default Product;

