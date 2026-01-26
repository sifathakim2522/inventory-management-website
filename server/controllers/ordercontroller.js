import Order from "../models/order.js";
import Product from "../models/Products.js"; // Verify if your file is 'Products.js' or 'Product.js'

// Add Order
const addOrder = async (req, res) => {
    try {
        const { customerName, customerAddress, productId, quantity } = req.body;

        // 1. Find Product to get price and check stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // 2. Check Stock
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: `Not enough stock. Only ${product.stock} left.` });
        }

        // 3. Calculate Total Price
        const totalPrice = product.price * quantity;

        // 4. Create Order
        const newOrder = new Order({
            customerName,
            customerAddress,
            product: productId,
            quantity,
            totalPrice
        });

        await newOrder.save();

        // 5. Update Product Stock (Decrease it)
        product.stock = product.stock - quantity;
        await product.save();

        return res.status(201).json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.error("Error adding order:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate({
                path: 'product',
                select: 'name price category', // Get specific fields
                populate: { 
                    path: 'category', 
                    select: 'categoryName' // Nested populate for Category Name
                }
            })
            .sort({ orderDate: -1 }); // Newest first

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addOrder, getOrders, deleteOrder };
