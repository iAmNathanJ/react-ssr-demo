import express from 'express';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { App } from '../../client/src/App';

const app = express();

app.get('/', (_, res) => {
  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(<div id="root"><App /></div>,
    {
      bootstrapScripts: ["app.js"],
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        res.setHeader('Content-type', 'text/html');
        stream.pipe(res);
      },
      onShellError() {
        res.statusCode = 500;
        res.send('<!doctype html><p>error</p>');
      },
      onError(err) {
        didError = true;
        console.error(err);
      }
    });
});

app.use(express.static("./build"));

app.listen(8000);
