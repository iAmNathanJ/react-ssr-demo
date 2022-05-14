import Koa, { Context } from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';

import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { App } from '../../client/src/App';

const app = new Koa();
const router = new Router();

router.get('/', (ctx: Context) => {
  let didError = false;
  return new Promise((resolve, reject) => {
    const stream = ReactDOMServer.renderToPipeableStream(<Html><App /></Html>,
      {
        onShellReady() {
          ctx.status = didError ? 500 : 200;
          ctx.set('Content-type', 'text/html');

          ctx.res.on('finish', resolve);
          ctx.body = stream.pipe(ctx.res);
        },
        onShellError() {
          ctx.status = 500;
          ctx.body = '<!doctype html><p>error</p>';
        },
        onError(err) {
          didError = true;
          reject(err);
        }
      });
  })
});

function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
      <title>Document</title>
    </head>
    <body>
      <div id="root">{children}</div>
      <script type="module" src="/index.js"></script>
    </body>
    </html>
  );
}

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(serve("./build"));

app.listen(8000);
