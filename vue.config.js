module.exports = {
  indexPath: '../index.html',
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/search-app-store/dist/'
    : '/'
}