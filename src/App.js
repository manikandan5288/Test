import React from "react";
import axios from 'axios';
import "./styles.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      country: [],
      searchError: ""
    };
  }
  onChangeHandle(event) {
    this.setState({ searchText: event.target.value }, () => {
      this.validateSearchText();
    });
  }

  validateSearchText() {
    const { searchText } = this.state;
    const countryRegEx = new RegExp("^[a-zA-Z ]*$");
    this.setState({
      searchError: searchText < 2 && !countryRegEx.test(searchText) ? 'Enter Valid Country name' : null
    });
  }

  onSearch() {
    const { searchText } = this.state;
    let url;
    if (searchText) {
      url = `https://restcountries.eu/rest/v2/name/${searchText}?fullText=true`;
    } else {
      this.setState({
        searchError: 'Enter Valid Country name'
      });
      return;
    }

    axios.get(url).then(response => response.data)
      .then((data) => {
        this.setState({ country: data });
      },
        error => {
          this.setState({
            searchError: 'Entered Country name not a availabe'
          });
        });
  }

  render() {
    let response = JSON.stringify(this.state.country);
    return (
      <div class="container">
        <div class="search-wrapper">
          <h2>Search Country</h2>
          <input
            id="countryName"
            placeholder="Enter Country Name"
            type="text"
            className={`${this.state.searchError ? 'errorClass' : ''}`}
            onChange={event => this.onChangeHandle(event)}
            value={this.state.searchText}
          />
          <button class="btn-cls" onClick={event => this.onSearch()}>Search</button>
          <div className='errorMessage'>{this.state.searchError}</div>
        </div>
        {!this.state.searchError &&
          <div class="content-wrapper">
            {
              this.state.country.map((country, i) =>
                <div class="country-info">
                  <h3>Country Details</h3>
                  <span><label>Country Name:</label>{country.name}</span>
                  <span><label>Capital:</label>{country.capital}</span>
                  <span><label>Population:</label>{country.population}</span>
                  <span><label>Currencies:</label>{country.currencies[i].code}</span>
                </div>)
            }
          </div>
        }

        <div class="currency-container">
          <h2>Currency converter</h2>
        </div>
      </div >

    );
  }
}
export default App;
