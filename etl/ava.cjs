module.exports = {
    extensions: ['ts'],
    require: ['ts-node/register'],
    timeout: '1m',
    files: ['src/datasets/eurostat/**/*.spec.ts'],
};
