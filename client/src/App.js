import React from 'react';
import './App.css';
import Nav from './components/Nav'
import Footer from './components/Footer'
import Main from './pages/Main'
import Admin from './pages/Admin'

function App() {
  return (
    <div>
      <Nav />
      {/* <Main /> */}
      <Admin />
      <Footer />
    </div>
  );
}

export default App;
