const webpack = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
    const options = {
        webpackOptions: require('../Frontend/guarantymetalui/node_modules/webpack/webpack.config.js'), // Adjust the path as necessary
        watchOptions: {},
    };

    on('file:preprocessor', webpack(options));
};
