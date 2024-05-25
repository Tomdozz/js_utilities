const fs = require("fs");
const path = require("path");
const { program } = require("commander");

// Function to parse Vue component file and generate markdown
function generateMarkdown(filePath, outputDir) {
  // Read the content of the Vue file
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Extract component name from file path
  const componentName = path.basename(filePath, ".vue");


  const markdownFilePath = path.join(outputDir, `${componentName}.md`);
  if (fs.existsSync(markdownFilePath)) {
    console.log(
      `Markdown file already exists for ${componentName}.md Skipping...`
    );
    return;
  }

  // Extract component description from <script> tag
  const descriptionMatch = fileContent.match(/<script.*?>([\s\S]*?)<\/script>/);
  const description = descriptionMatch
    ? descriptionMatch[1].trim()
    : "No description provided.";

  // Generate markdown content
  const markdownContent = `# ${componentName}\n\n## Usage\n\n\`\`\`vue\n<template>\n\n</template>\n\`\`\`\n\n${description}\n\n## Props\n\n## Events\n\n## Styling\n\n## Configuration Options`;

  // Write markdown content to file
  fs.writeFileSync(markdownFilePath, markdownContent);

  console.log(`Generated ${markdownFilePath}`);
}

// Function to recursively find Vue component files in a directory
function findVueFiles(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir);
  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findVueFiles(filePath, outputDir);
    } else if (path.extname(file) === ".vue") {
      generateMarkdown(filePath, outputDir);
    }
  });
}

// Configure command-line options
program
  .option("-i, --input <inputDir>", "Input directory containing Vue components")
  .option(
    "-o, --output <outputDir>",
    "Output directory to store generated markdown files"
  );
console.log(process.argv);
program.parse(process.argv);

const input = program.opts().input;
console.log(input);
const output = program.opts().output;
console.log(output);
// Validate input and output directories
if (!input || !output) {
  console.error("Error: Input and output directories are required.");
  program.help();
} else {
  // Run the script
  findVueFiles(input, output);
}
