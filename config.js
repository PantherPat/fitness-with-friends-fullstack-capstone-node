
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds231070.mlab.com:31070/recipe-search-node-captstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://demo:demo123@ds231070.mlab.com:31070/recipe-search-node-captstone';
exports.PORT = process.env.PORT || 8080;
