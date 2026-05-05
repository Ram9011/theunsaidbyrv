import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distClientPath = path.resolve(__dirname, '../dist/client');
const distPath = path.resolve(__dirname, '../dist');
const distServerPath = path.resolve(__dirname, '../dist/server');

const copyDirSync = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const removeDirSync = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        removeDirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dir);
  }
};

try {
  if (fs.existsSync(distClientPath)) {
    console.log('Flattening dist structure...');
    copyDirSync(distClientPath, distPath);
    removeDirSync(distClientPath);
    removeDirSync(distServerPath);
    console.log('✓ Dist structure flattened successfully');
  } else {
    console.log('No dist/client folder found, skipping flattening');
  }
} catch (error) {
  console.error('Error flattening dist:', error);
  process.exit(1);
}
