import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import GeoLocations from "./pages/geoLocations"
import NotFound from "./components/NotFound"
function App() {
  return (
     <Router>
        <Routes>
          <Route path = '/' element = {<Navigate to="/locations" replace />}/>
          <Route path = '/locations' element = {<GeoLocations/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
     </Router>
  );
}

export default App;
