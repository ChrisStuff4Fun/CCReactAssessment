
import './App.css';
import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Start          from './Pages/start.js';
import EnterPostcodes from './Pages/enterPostcodes.js';
import Results        from './Pages/results.js';



function App() {
 
 return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Start/>} />
        <Route path="/postcodes" element={<EnterPostcodes/>} />
        <Route path="/results" element={<Results/>} />
      </Routes>
    </BrowserRouter>
  );
 
}


export default App;
