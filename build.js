const nodemon = require('nodemon');
const { build } = require('esbuild')
const { watch } = require('chokidar');

(async () => {
  await Promise.all([
    buildClient(),
    buildServer(),
  ]);

  nodemon({
    script: 'build/koa-server.js',
    watch: 'build/koa-server.js',
  }).on("log", nodemonOutput);

  watch(['./client/**', './server/**']).on('change', () => {
    buildClient();
    buildServer();
  });
})();

async function buildClient() {
  await build({
    entryPoints: ['client/src/index.tsx'],
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: 'build',
  });

  console.log('built client');
}

async function buildServer() {
  await build({
    entryPoints: ['server/src/koa-server.tsx', 'server/src/express-server.tsx'],
    bundle: true,
    platform: 'node',
    outdir: 'build'
  });

  console.log('built server');
}

function nodemonOutput(message) {
  console.log(message.colour);
}
