import React from "react";
import axios from 'axios';
import "../Converter/Converter.css"

const SECRECT_KEY = '76f5ea65dcc33674258094294818f787';
const ERROR_MESSAGE_EXIST = "You can't convert the same currency!";

class Converter extends React.Component {
  state = {
    baseCurrency: 'SEK',
    toCurrency: "INR", // default currency code
    amount: 1,
    baseCurrencyValue: 0,
    result: 0,
    currencies: [],
    currencyRates: [],
    error: null
  };

  componentDidMount() {
    let url = `http://data.fixer.io/api/latest?access_key=${SECRECT_KEY}`;
    try {
      axios.get(url).then(response => {
        if (response.data.success) {
          const currencyAr = [];
          let baseCurrencyVal;
          for (let key in response.data.rates) {
            baseCurrencyVal = response.data.rates[this.state.baseCurrency];
            currencyAr.push(key)
          }
          this.setState({
            baseCurrencyValue: baseCurrencyVal,
            currencies: currencyAr.sort(),
            currencyRates: response.data.rates
          });
          this.convertHandler(this.state.amount, this.state.toCurrency);
        } else {
          console.log(response.data.error.type)
          this.setState({ error: response.data.error.type });
        }
      })
        .catch(err => {
          this.setState({ error: err.message });
        });
    } catch (e) {
      this.setState({ error: e });
    }
  }

  onChangeHandle(e) {
    this.setState({ amount: e.target.value })
    this.convertHandler(e.target.value, this.state.toCurrency);
  }

  // Updates the states based on the dropdown that was changed
  selectHandler = (event) => {
    this.setState({ toCurrency: event.target.value })
    this.convertHandler(this.state.amount, event.target.value);
  }

  // Event handler for the conversion
  convertHandler = (amount, toCurrencyCode) => {
    if (this.state.baseCurrency !== toCurrencyCode) {
      let toCurrencyVal;
      for (let key in this.state.currencyRates) {
        toCurrencyVal = this.state.currencyRates[toCurrencyCode];
      }
      let convertedValue = (amount / this.state.baseCurrencyValue) * toCurrencyVal;
      this.setState({
        result: convertedValue ? convertedValue.toFixed(2) : 0,
        error: ''
      })

    } else {
      this.setState({ result: 0 })
      this.setState({ error: ERROR_MESSAGE_EXIST });
    }
  };

  render() {
    return <div className="converter-container">
      <h2>Currency Converter Section</h2>
      <label>Enter SEK Amount</label>
      <input
        name="amount"
        type="number"
        placeholder="Enter SEK Amount"
        value={this.state.amount}
        onChange={event => this.onChangeHandle(event)}
      />
      <label> to </label>
      <select
        name="to"
        onChange={(event) => this.selectHandler(event)}
        value={this.state.toCurrency}
      >
        {this.state.currencies.map(currency => (
          <option key={currency}>{currency}</option>
        ))}
      </select>
      <label> = </label>
      <input
        name="converted-amount"
        className="readOnly"
        type="text"
        value={`${this.state.result} ${this.state.toCurrency}`}
        readOnly
      />
      <div className='errorMessage'>{this.state.error}</div>
    </div >;
  }
}
export default Converter;
