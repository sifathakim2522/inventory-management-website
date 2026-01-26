import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
