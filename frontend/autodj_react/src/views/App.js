import React from 'react';
import logo from './new_logo.png';
import Button from 'react-bootstrap/Button';
import './Styles.css';


function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <div className="content-center brand">
            <h1 className="h1-seo">AutoDJ</h1>
            <h3 className="d-none d-sm-block">
            Using spotify profiles to curate a playlist perfect for your party
              </h3>
        </div>

        <Button variant="primary" href= {"http://localhost:3000" + "/login"}> Start building your playlist! </Button>
      </header>
    </div>
  );
}

export default App;
