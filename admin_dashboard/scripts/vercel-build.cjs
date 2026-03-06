const { execSync } = require('child_process');
const fs = require('fs');

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

run('npm install');
run('npm install --prefix ../frontend');
run('npm run build --prefix ../frontend');
run('npm run build');

fs.rmSync('dist/admin', { recursive: true, force: true });
fs.mkdirSync('dist/admin', { recursive: true });
fs.rmSync('dist/frontend', { recursive: true, force: true });
fs.cpSync('../frontend/dist', 'dist/frontend', { recursive: true });
fs.cpSync('dist/assets', 'dist/admin/assets', { recursive: true });
fs.copyFileSync('dist/index.html', 'dist/admin/index.html');
fs.rmSync('dist/assets', { recursive: true, force: true });
fs.cpSync('../frontend/dist/assets', 'dist/assets', { recursive: true });
