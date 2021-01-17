const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude, if not --- would be used for filtering
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc) from query: .../courses?cost[lte]=100
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  // Normally: Course.find(req.query)  ---- Course.find({"title": "geometry"})
  query = model.find(JSON.parse(queryStr));
  
  // Select Fields
  // courses?select=title,description --- Mongoose method: query.select('title description')
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  // courses?sort=title     .../courses?sort=-title  (descending order, z -> a)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Pagination
  // 10 here is radix   ... || def value
  // courses  ---> by def ?page=1&limit=25
  // page --- current page, limit --- num of items per page
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //if this El1 has associated [El2]
  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query; 
  // Pagination result
  /*
    pagination: {
      prev: { page: 2, limit: 3 },
      next: { page: 4, limit: 3 }
    }
  */
 // if page 1 --- only next, if last page --- only prev
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  // object sent to front: 
  /*
  {
    success: true, 
    count: 15, 
    pagination, 
    data: [{.....}, {.....}]
  }
  */
  res.advancedResults = {
    success: true,
    count: results.length,
    total,    
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
