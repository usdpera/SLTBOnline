const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app'); // Import your existing Express app

// Create server from the Express app
const server = awsServerlessExpress.createServer(app);

// Lambda handler
exports.dashboard = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

// Add other handlers for other routes (if required)
exports.auth = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

exports.bus = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

exports.route = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
