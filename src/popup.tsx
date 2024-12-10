/* @refresh reload */
import { render } from 'solid-js/web';
import type { Component } from 'solid-js';
import './index.css';
// import App from './App';
import { Link } from "@suid/material"
import { Button } from "@suid/material"


const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const App: Component = () => {
  return (
    <div style={{width: '400px', height: '600px'}}>
      <Button variant='text' onClick={(e) => chrome.runtime.openOptionsPage()}>
        go to config panel
      </Button>
    </div>
  );
};


render(() => <App />, root!);
