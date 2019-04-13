class Pagination {
  static init(queryObj) {
    const { page = 1, limit = 10 } = queryObj;
    const offset = limit * (page - 1);

    return {
      page: +page,
      limit: +limit,
      offset: +offset,
    };
  }

  static getPaginationMeta(data, page, limit) {
    const { count, rows } = data;
    return {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      currentPageSize: rows.length,
      totalRecords: count,
    };
  }
}

export default Pagination;
