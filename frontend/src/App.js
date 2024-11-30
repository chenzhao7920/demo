import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
function App() {
  return (
     <Router>
        <Routes>
          <Route path = '/' element = {<>"Hello world"</>}/>
          <Route path = '/dashboard' element = {<>"Hello Dashboard"</>}/>
        </Routes>
     </Router>
  );
}

export default App;
