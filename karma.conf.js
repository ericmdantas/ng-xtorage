module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      'ng-xtorage.js',

      '*_test.js'
    ],
    exclude: [],
    preprocessors: {
      'ng-xtorage.js': 'coverage'
    },
    coverageReporter:
    {
      type: 'lcov',
      dir: 'coverage'
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chrome', 'IE', 'Opera', 'Safari', 'Firefox', 'FirefoxNightly', 'ChromeCanary'],
    singleRun: false
  });
};
