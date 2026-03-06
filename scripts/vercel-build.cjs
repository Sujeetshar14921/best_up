const { execSync } = require('child_process');
const fs = require('fs');

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

run('npm install --prefix frontend');
run('npm install --prefix admin_dashboard');
run('npm run build --prefix frontend');
run('npm run build --prefix admin_dashboard');

fs.rmSync('frontend/dist/admin', { recursive: true, force: true });
fs.cpSync('admin_dashboard/dist', 'frontend/dist/admin', { recursive: true });
