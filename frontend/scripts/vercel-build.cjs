const { execSync } = require('child_process');
const fs = require('fs');

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

run('npm install');
run('npm install --prefix ../admin_dashboard');
run('npm run build');
run('npm run build --prefix ../admin_dashboard');

fs.rmSync('dist/admin', { recursive: true, force: true });
fs.cpSync('../admin_dashboard/dist', 'dist/admin', { recursive: true });
