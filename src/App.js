import React from "react";
import "./styles.css";
import SearchCountry from "./components/SearchCountry/SearchCountry.js"
import Converter from "./components/Converter/Converter.js"

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <SearchCountry />
        <Converter />
      </div >

    );
  }
}
export default App;
