const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            unique: true,
            trim: true,
            minlength: [2, 'Brand name must be at least 2 characters'],
            maxlength: [32, 'Brand name must be less than 32 characters']
        },
        slug: {
            type: String,
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

brandSchema.pre('save', function () {
    this.slug = slugify(this.name, {
        lower: true
    });

});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;