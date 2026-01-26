import Product from "../models/Products.js"; // Ensure filename matches (Products.js)
import Order from "../models/order.js";      // Ensure filename matches (order.js)

const getDashboardStats = async (req, res) => {
    try {
        // Run all queries in parallel for speed
        const [
            totalProducts,
            totalOrders,
            totalStockResult,
            totalRevenueResult,
            lowStockProducts,
            topSellingProducts
        ] = await Promise.all([
            
            // 1. Count Total Products
            Product.countDocuments(),

            // 2. Count Total Orders
            Order.countDocuments(),

            // 3. Sum Total Stock
            Product.aggregate([
                { $group: { _id: null, total: { $sum: "$stock" } } }
            ]),

            // 4. Sum Total Revenue
            Order.aggregate([
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // 5. Get Low Stock & Out of Stock (Limit 5)
            Product.find({ stock: { $lt: 6 } }) // Less than 6 means 5,4,3,2,1,0
                .sort({ stock: 1 }) // Show 0 stock first
                .limit(5),

            // 6. Get Top 5 Best Selling Products
            Order.aggregate([
                { 
                    $group: { 
                        _id: "$product", 
                        totalSold: { $sum: "$quantity" } 
                    } 
                },
                { $sort: { totalSold: -1 } }, // Highest first
                { $limit: 5 },
                {
                    $lookup: { // Join with Products table to get names
                        from: "products", // Must match MongoDB collection name (usually lowercase plural)
                        localField: "_id",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                { $unwind: "$productDetails" } // Flatten the array
            ])
        ]);

        const stats = {
            totalProducts,
            totalOrders,
            totalStock: totalStockResult[0]?.total || 0,
            totalRevenue: totalRevenueResult[0]?.total || 0,
            lowStockProducts,
            topSellingProducts: topSellingProducts.map(item => ({
                name: item.productDetails.name,
                totalSold: item.totalSold
            }))
        };

        return res.status(200).json({ success: true, stats });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getDashboardStats };
