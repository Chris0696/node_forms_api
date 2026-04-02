// Pagination + filtres — comme PageNumberPagination + django-filter en DRF
const paginate = async (model, filter = {}, query = {}, options = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tri : ?sort=title ou ?sort=-createdAt (- = descendant)
    let sort = { createdAt: -1 };
    if (query.sort) {
        const sortField = query.sort.startsWith('-') ? query.sort.slice(1) : query.sort;
        const sortOrder = query.sort.startsWith('-') ? -1 : 1;
        sort = { [sortField]: sortOrder };
    }

    // Select : champs à peupler (populate)
    let dbQuery = model.find(filter).sort(sort).skip(skip).limit(limit); // La requête de base
    if (options.populate) {
        dbQuery = dbQuery.populate(options.populate);
    }

    const [results, total] = await Promise.all([ // Exécuter la requête et compter le total en parallèle
        dbQuery,
        model.countDocuments(filter),
    ]);

    return {
        results,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit), // Calculer le nombre total de pages
        },
    };
};

module.exports = paginate;
