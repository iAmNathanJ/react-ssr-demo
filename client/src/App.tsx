import React, { useEffect, useState, startTransition } from 'react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function App() {
  const SlowMessage = React.lazy(async () => {
    await sleep(3000);
    return import('./Message')
  });

  const [clientMessage, setClientMessage] = useState('');

  useEffect(() => {
    startTransition(() => setClientMessage('Client message'));
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
