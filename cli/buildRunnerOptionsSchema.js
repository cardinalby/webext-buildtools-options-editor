const path = require("path");
const TJS = require("typescript-json-schema");
const fs = require("fs");

const settings = {
    required: true
};

const compilerOptions = {
    strictNullChecks: true
}

const integratedBuilderIndex = require.resolve('webext-buildtools-integrated-builder');
const optionsDeclFile = path.dirname(integratedBuilderIndex) + path.sep +
    ['..', 'declarations', 'buildRunnerOptions.d.ts'].join(path.sep);

const program = TJS.getProgramFromFiles([path.resolve(optionsDeclFile)], compilerOptions);

const schema = TJS.generateSchema(program, "IBuildRunnerOptions", settings);
if (schema === null) {
    console.error('Error generating schema');
    process.exit(1);
}

const distDir = './dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const schemaJson = JSON.stringify(schema);
fs.writeFileSync(distDir + '/buildRunnerOptions.schema.json', schemaJson);
fs.writeFileSync(distDir + '/buildRunnerOptionsSchema.js', 'export default ' + schemaJson + ';');