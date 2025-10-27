// Use Puppeteer Chromium if Chrome is not available
process.env.CHROME_BIN = process.env.CHROME_BIN || (function(){ try { return require('puppeteer').executablePath(); } catch { return undefined; } })();

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      // Ejecuta pruebas de utils como módulos ES nativos
      { pattern: 'src/utils/**/*.spec.js', type: 'module', included: true },
      // Permite que los specs importen lógica desde utils/
      { pattern: 'src/utils/**/*.js', type: 'module', included: false }
    ],
    reporters: ['spec'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
