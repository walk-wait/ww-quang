import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Nav from './components/Nav'
import Footer from './components/Footer'
import Main from './pages/Main'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <div>
        <Nav />
          <Switch>
            <Route exact path="/" component={Main}/>
            <Route exact path="/admin" component={Admin}/>       
          </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
