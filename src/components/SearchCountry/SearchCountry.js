import React from "react";
import axios from 'axios';
import "../SearchCountry/SearchCountry.css"

const VALID_COUNTRY_NAME = 'Enter Valid Country name';
const COUNTRY_NOT_AVAILABLE = 'Entered Country name not availabe';
const COUNTRY_REGEX = new RegExp("^[a-zA-Z ]*$");

class SearchCountry extends React.Component {
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
        this.setState({
            country: [],
            searchError: searchText.length < 2 || !COUNTRY_REGEX.test(searchText) ? VALID_COUNTRY_NAME : null
        });
    }

    onSearch() {
        const { searchText } = this.state;
        let url;
        if (searchText && COUNTRY_REGEX.test(searchText)) {
            url = `https://restcountries.eu/rest/v2/name/${searchText}?fullText=true`;
        } else {
            this.setState({
                searchError: VALID_COUNTRY_NAME
            });
            return;
        }

        axios.get(url).then(response => response.data)
            .then((data) => {
                this.setState({ country: data });
                this.setState({ searchText: '' }); // reseting the searchbox
            },
                error => {
                    this.setState({
                        searchError: COUNTRY_NOT_AVAILABLE
                    });
                });
    }

    render() {
        return <div className="search-wrapper">
            <h2>Search Country</h2>
            <input
                id="countryName"
                placeholder="Enter Country Name"
                type="text"
                className={`${this.state.searchError ? 'errorClass' : ''}`}
                onChange={event => this.onChangeHandle(event)}
                value={this.state.searchText}
            />
            <button className="btn-cls" onClick={event => this.onSearch()}>Search</button>
            <div className='errorMessage'>{this.state.searchError}</div>
            {!this.state.searchError &&
                <div className="content-wrapper">
                    {!this.state.country.length ? (<span>No Search data Available</span>) : ''}
                    {
                        this.state.country.map((country, i) =>
                            <div className="country-info" key={i}>
                                <h3>Country Details</h3>
                                <span><label>Country Name:</label>{country.name}</span>
                                <span><label>Capital:</label>{country.capital}</span>
                                <span><label>Population:</label>{country.population}</span>
                                <span><label>Currencies:</label>{country.currencies[i].code}</span>
                            </div>)
                    }
                </div>
            }
        </div>
    }
}

export default SearchCountry
