let PaginationHelper = {
  getProperties: function (pagination) {
    let page = 1
    let perPage = 20
    let skipElements = 0
    if (pagination) {
      page = pagination.page
      perPage = pagination.perPage
      skipElements = page * perPage
    }
    return { page, perPage, skipElements }
  },
  getTotals:  async (entries, perPage) => {
    const totalEntries = await entries.getCount()
    const totalPages = Math.ceil(totalEntries / perPage)
    return { totalEntries, totalPages }
  }
}

export default PaginationHelper
