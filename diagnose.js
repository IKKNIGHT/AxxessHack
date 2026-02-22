#!/usr/bin/env node

// Diagnostic script to check environment setup
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🔍 Axxess Heart Health - Environment Diagnostic\n');

// Check .env file
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
console.log('Checking .env file...');
if (fs.existsSync(envPath)) {
    console.log('✓ .env file found at:', envPath);
} else {
    console.log('✗ .env file NOT found at:', envPath);
}

// Check environment variables
console.log('\nEnvironment Variables:');
const apiKey = process.env.OPENROUTER_API_KEY;
if (apiKey) {
    console.log('✓ OPENROUTER_API_KEY is set');
    console.log('  First 10 chars:', apiKey.substring(0, 10) + '...');
} else {
    console.log('✗ OPENROUTER_API_KEY is NOT set');
}

// Check Python
console.log('\nChecking Python...');
const { execSync } = require('child_process');
try {
    const pythonVersion = execSync('python --version').toString().trim();
    console.log('✓ Python found:', pythonVersion);
} catch (e) {
    console.log('✗ Python not found or not in PATH');
}

// Check Node.js version
console.log('\nNode.js:');
console.log('✓ Node.js version:', process.version);

// Check npm
console.log('\nChecking npm...');
try {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log('✓ npm found:', npmVersion);
} catch (e) {
    console.log('✗ npm not found');
}

// Check required Python packages
console.log('\nChecking Python packages...');
try {
    execSync('python -c "import flask; import flask_cors; import joblib; import pandas"', { stdio: 'pipe' });
    console.log('✓ All required Python packages installed');
} catch (e) {
    console.log('✗ Missing Python packages. Run: pip install flask flask-cors joblib pandas');
}

// Check required Node packages
console.log('\nChecking Node packages...');
const packages = ['express', 'cors', 'dotenv'];
for (const pkg of packages) {
    try {
        require.resolve(pkg);
        console.log(`✓ ${pkg} is installed`);
    } catch (e) {
        console.log(`✗ ${pkg} is NOT installed. Run: npm install ${pkg}`);
    }
}

// Check model files
console.log('\nChecking model files...');
['framingham_rf_model.pkl', 'feature_names.pkl'].forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✓ ${file} found`);
    } else {
        console.log(`✗ ${file} NOT found. Run train.py first`);
    }
});

console.log('\n✅ Diagnostic complete!');
