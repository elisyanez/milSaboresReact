module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/utils/**/*.js', // incluye toda la lógica primero
            '!src/utils/**/*.spec.js', // excluye los tests de este bloque
            'src/**/*.spec.js' // incluye los tests después
        ],
        reporters: ['spec'], // reporter legible (recomendado)
        browsers: ['ChromeHeadless'], // usa Chrome invisible
        singleRun: true, // corre una vez y termina
        concurrency: Infinity
    });
};