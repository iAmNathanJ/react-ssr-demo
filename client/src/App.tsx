import React, { useEffect, useState } from 'react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SlowMessage = React.lazy(async () => {
  await sleep(3000);
  return import('./Message')
});

export function App() {
  const [clientMessage, setClientMessage] = useState('');

  useEffect(() => {
    setClientMessage('Client message');
  });

  return (
    <>
      <h1>Hello World!</h1>
      <h2>{clientMessage}</h2>
      <React.Suspense fallback={<h3>loading...</h3>}>
        <SlowMessage />
      </React.Suspense>
    </>
  )
}
