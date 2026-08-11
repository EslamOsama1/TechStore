const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Category name must be at least 2 characters'],
        maxlength: [32, 'Category name must be less than 32 characters']
    },
    slug: {
        type: String,
        lowercase: true
    }
}, {
    timestamps: true
})

categorySchema.pre('save', function () {
    this.slug = slugify(this.name, {
        lower: true
    })
})

const Category = mongoose.model("Category", categorySchema)

module.exports = Category