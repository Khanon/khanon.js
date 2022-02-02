const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'string-replace-loader',
                options: {
                    search: '/* babylonjs-debugLayer */',
                    replace: `import '@babylonjs/core/Debug/debugLayer';`,
                },
            },
            {
                test: /\.(ts|js)x?$/,
                loader: 'string-replace-loader',
                options: {
                    search: '/* babylonjs-inspector */',
                    replace: `import '@babylonjs/inspector';`,
                },
            },
        ],
    },
    mode: 'development',
    devtool: 'eval-source-map',
});
