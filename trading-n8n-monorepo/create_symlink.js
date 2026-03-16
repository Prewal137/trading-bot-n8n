const fs = require('fs');
const path = require('path');
try {
  fs.symlinkSync(
    path.resolve('packages/common'),
    path.resolve('node_modules/@repo/common'),
    'junction'
  );
  console.log('Symlink created successfully.');
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log('Symlink already exists.');
  } else {
    console.error('Failed to create symlink:', err);
  }
}
