exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds335275.mlab.com:35275/fitness-with-friends-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://demo:demo123@ds335275.mlab.com:35275/fitness-with-friends-capstone';
exports.PORT = process.env.PORT || 5000;
exports.JWT_SECRET = "secret_word";
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
