import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'

const macroDir = path.resolve(__dirname, 'macro')
const distDir = path.resolve(__dirname, '..', 'dist')

// Ensure the dist directory exists.
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

// Get all subdirectories in the src directory.
const getDirectories = (source: string) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

const subDirs = getDirectories(macroDir)

// Build each subdirectory.
subDirs.forEach((dir) => {
  const entryFile = path.join(macroDir, dir, 'index.ts')
  const outputDir = path.join(distDir, dir)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  esbuild
    .build({
      entryPoints: [entryFile],
      bundle: true,
      outfile: path.join(outputDir, 'index.js'),
      platform: 'node', // If it's for the browser, change this to 'browser'
      target: 'es2020', // Change this to your desired target.
      loader: { '.ts': 'ts' },
    })
    .catch((error) => console.error(error))
})
