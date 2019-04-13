/**
 *
 *
 * @class Pagination
 */
class Pagination {
  /**
   * initialize pagination setup
   *
   * @static
   * @param {obj} queryObj query param object
   * @returns {object}
   * @memberof Pagination
   */
  static init(queryObj) {
    const { page = 1, limit = 10 } = queryObj;
    const offset = limit * (page - 1);

    return {
      page: +page,
      limit: +limit,
      offset: +offset,
    };
  }

  /**
   * get pagination meta data
   *
   * @static
   * @param {object} data sequelize model data
   * @param {number} page current page
   * @param {number} limit number of items to be returned
   * @returns
   * @memberof Pagination
   */
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
