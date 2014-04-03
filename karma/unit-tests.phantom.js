module.exports = function(config) {
  config.set({
    autoWatch: false,
    basePath: '..',
    frameworks: [
      'mocha',
      'chai',
      'sinon'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    files: [
      'bower_components/lodash/dist/lodash.js',
      'search-query.js',
      '**/*.spec.js'
    ]
  });
};