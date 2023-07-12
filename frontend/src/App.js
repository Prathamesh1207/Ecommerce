import React from "react";
import "./App.css";
import Header from "./components/layout/Headers/Header.js"
import Footer from "./components/layout/Footer/Footer.js"
import {BrowserRouter as Router, Routes} from "react-router-dom"
import { Route } from 'react-router-dom';
import WebFont from "webfontloader";
import Home from "./components/Home/Home.js"




function App() {
  React.useEffect(()=>{
  WebFont.load({
    google:{
      families:["Roboto" , "Droid Sans" ,"Chilanka"]
    }
  })
},[])
  

  return (
    <Router> 
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>

      


      <Footer />
    </Router>
    
  );
}

export default App;
