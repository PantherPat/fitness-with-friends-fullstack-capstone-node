
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds335275.mlab.com:35275/fitness-with-friends-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://demo:demo123@ds335275.mlab.com:35275/fitnessfriends';
exports.PORT = process.env.PORT || 3000;
