const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const shell = require('shelljs');

const program = new Command();

program
  .version('1.0.0')
  .description('Create a Vue project with a custom folder structure')
  .option('-n, --name <name>', 'Project name', 'my-vue-project')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .parse(process.argv);

const options = program.opts();
const projectName = options.name;
const projectDir = path.resolve(options.path, projectName);
const location = path.resolve(options.path)

// Function to execute shell commands
function executeCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
    if (callback) callback();
  });
}

// Function to create custom folder structure
function setupFolderStructure(projectName) {
  const folders = [
    `src/assets`,
    `src/components`,
    `src/layouts`,
    `src/router`,
    `src/store`,
    `src/views`,
    `src/unit`
  ];

  folders.forEach(folder => {
    const folderPath = path.join(projectDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }
  });

  // Optional: Create example files
  const files = [
    `src/router/index.js`,
    `src/store/index.js`
  ];

  files.forEach(file => {
    const filePath = path.join(projectDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(`Created file: ${filePath}`);
    }
  });

  console.log('Custom folder structure has been created.');
}

// Ensure the target directory exists
shell.mkdir('-p', location);

// Change to the target directory
shell.cd(location);

// Step 1: Create Vue project
executeCommand(`vue create ${projectName} --default`, () => {
  // Step 2: Change directory to the project directory
  shell.cd(projectDir);
  // Step 3: Setup custom folder structure
  setupFolderStructure(projectName);
});
