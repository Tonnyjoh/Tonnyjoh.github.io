// Minifies every script in src/script/ into src/dist/script/<name>.min.js.
// orb.js is an ES module (top-level `import`), everything else is a classic script
// relying on global scope (e.g. translations.js exposes `translations` for language.js).
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const SRC_DIR = path.join(__dirname, '..', 'src', 'script');
const OUT_DIR = path.join(__dirname, '..', 'src', 'dist', 'script');
const MODULE_FILES = new Set(['orb.js']);

async function build() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const code = fs.readFileSync(srcPath, 'utf8');
    const isModule = MODULE_FILES.has(file);
    const result = await minify(code, {
      module: isModule,
      compress: true,
      mangle: true,
    });
    if (result.error) throw result.error;

    const outName = file.replace(/\.js$/, '.min.js');
    const outPath = path.join(OUT_DIR, outName);
    fs.writeFileSync(outPath, result.code);
    console.log(`${file} -> src/dist/script/${outName}`);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
