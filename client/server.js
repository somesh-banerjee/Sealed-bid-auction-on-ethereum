const next = require('next');
const routes = require('./routes');
const app = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(app);

const args = process.argv.slice(2);

const {createServer} = require('http');
app.prepare().then(() => {
  createServer(handler).listen(args[0], err => {
      if (err) throw err;
      console.log('Ready on localhost');
  });
});
