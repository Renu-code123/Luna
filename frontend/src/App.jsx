import React from 'react';
import Luna from './components/main/Luna';
import './index.css';
import './App.css';

import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Luna />
      </div>
    </BrowserRouter>
  );
}

export default App;