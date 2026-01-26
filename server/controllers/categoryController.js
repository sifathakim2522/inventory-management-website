import Category from '../models/Category.js';

const addCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const newCategory = new Category({
            categoryName,
            categoryDescription,
        });

        await newCategory.save();
        return res.status(201).json({ success: true, message: "Category added successfully" });
    } catch (error) {
        console.error("Error adding category:", error);
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ success: false, message: "Server Error in getting categories" });
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { categoryName, categoryDescription } = req.body;

        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { categoryName, categoryDescription },
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ success: false, message: error.message || "Server Error in updating category" });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Find and delete the category in one step
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        // If no category was found with that ID
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ success: false, message: error.message || "Server Error in deleting category" });
    }
}

export { addCategory, getCategories, updateCategory, deleteCategory };
