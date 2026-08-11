class APIFeature {
    constructor(query, queryStr) {
        this.query = query; //Product.find()
        this.queryStr = queryStr; //req.query = "price[gte]=10000&sort=-price&page=2"
    }

    filter() {
        let queryObj = { ...this.queryStr };
        const excludedFields = ['page', 'limit', 'sort', 'fields'];
        excludedFields.forEach(e => delete queryObj[e])

        console.log(queryObj);
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {

            this.query = this.query.sort('-createdAt')

        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }


}

module.exports = APIFeature