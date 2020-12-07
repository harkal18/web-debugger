const path = require('path');

module.exports = [
    {
        entry: './src/client.ts',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '__web_debugger_client__.js',
            path: path.resolve(__dirname, 'dist'),
        },
    },
    {
        entry: './src/debugger.ts',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '__web_debugger_debugger__.js',
            path: path.resolve(__dirname, 'dist'),
        },
    }];
