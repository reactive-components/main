module.exports = {
  name: 'log',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/log',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
