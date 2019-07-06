import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Nav from './components/Nav'
import Footer from './components/Footer'
import Main from './pages/Main'
import Admin from './pages/Admin'
import Err from './pages/404'

function App() {
  return (
    <Router>
      <div style={{backgroundColor: "#212121"}}>
        <Nav />
          <Switch>
            <Route exact path="/" component={Main}/>
            <Route exact path="/admin" component={Admin}/>
            <Route component={Err} />       
          </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
