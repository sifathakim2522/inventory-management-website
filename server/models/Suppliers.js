import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // No duplicate emails
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
