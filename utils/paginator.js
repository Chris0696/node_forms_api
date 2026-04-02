// Pagination — comme PageNumberPagination en DRF
// Usage: const result = await paginate(Form, {}, req.query);
const paginate = async (model, filter = {}, query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
        model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        model.countDocuments(filter),
    ]);

    return {
        results,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

module.exports = paginate;
