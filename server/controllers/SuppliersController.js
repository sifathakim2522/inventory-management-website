import Supplier from "../models/Suppliers.js";

// Add Supplier
const addSupplier = async (req, res) => {
    try {
        const { name, email, contact, address } = req.body;
        
        // Check if email already exists
        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ success: false, message: "Supplier email already exists" });
        }

        const newSupplier = new Supplier({ name, email, contact, address });
        await newSupplier.save();
        
        return res.status(201).json({ success: true, message: "Supplier added successfully" });
    } catch (error) {
        console.error("Error adding supplier:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get All Suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({}).sort({ createdAt: -1 }); // Newest first
        return res.status(200).json({ success: true, suppliers });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, contact, address } = req.body;

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { name, email, contact, address },
            { new: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        return res.status(200).json({ success: true, message: "Supplier updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete Supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSupplier = await Supplier.findByIdAndDelete(id);

        if (!deletedSupplier) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
