const routes = require('next-routes')();

routes
  .add('/auctions/:address(0x[a-zA-Z0-9]{40,40})', '/auctions/[id]');

module.exports = routes;
