import React, { Component} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";

import {Doughnut} from 'react-chartjs-2';


class Investments extends Component {

  state = {
    user: this.props.auth,
    investments: [],
    investmentId: "",
    companyName: "",
    stockTag: "",
    numberOfShares: 0,
    addInvestment: false,
    editInvestment: false,
    stockPricesArr: [],
    stockTags: []
  }

  componentDidMount() {
    this.getInvestments()
    
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  
  getInvestments = () => {
    fetch('/api/investments/' + this.state.user.user.id)
    .then(res => res.json())
    .then(jsonedInvestments => this.setState({investments: jsonedInvestments, stockPricesArr: [], stockTags: []}))
    .then(this.getStockTags)
    .then(this.getStocksPrices)
    .catch( error => console.error(error))
  }

  handleInvestmentSubmit = (event) => {
      event.preventDefault()
      fetch('/api/investments/create',{
      body: JSON.stringify({
        userId: this.state.user.user.id,
        companyName: this.state.companyName,
        stockTag: this.state.stockTag,
        numberOfShares: this.state.numberOfShares
      }),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      this.setState({
          companyName: '',
          stockTag: '',
          numberOfShares: 0

      })
    })
    .then(this.handleCloseInvestmentForm)
    .then(this.getInvestments)
    .catch(error => console.error({ Error: error }));
  }

  
  
  // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  //Form conditionals

  handleOpenInvestmentForm = () => {
    this.setState({addInvestment: true})
  }

  handleCloseInvestmentForm = () => {
    this.setState({addInvestment: false})
  }

  handleEditForm = (investment) => {
    this.setState({
      editInvestment: true,
      addInvestment: false,
      investmentId: investment._id,
      companyName: investment.companyName,
      stockTag: investment.stockTag,
      numberOfShares: investment.numberOfShares

    })
  }

  handleCloseEditForm = () => {
    this.setState({
      editBudget: false,
      investmentId: "",
      companyName: "",
      stockTag: "",
      numberOfShares: 0
    })
  }

  deleteInvestment = id => {
    fetch('/api/investments/' + id, {
      method: 'DELETE'
    }).then( res => {
      const investmentsArr = this.state.investments.filter( investment => {
        return investment.id !== id
      })
      this.setState({
        investments: investmentsArr
      })
    }).then(this.getInvestments())
  }


  handleEditInvestmentSubmit = () => {
    fetch('/api/investments/' + this.state.investmentId,{
        body: JSON.stringify({
          userId: this.state.user.user.id,
          companyName: this.state.companyName,
          stockTag: this.state.stockTag,
          numberOfShares: this.state.numberOfShares
        }),
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })  
      .then(this.handleCloseEditInvestmentForm)
      .then(this.getInvestments)
      .catch(error => console.error({ Error: error }));
  }

  //STOCKS:

  //Get stock tags:
  getStockTags = () => {
    let stockTags = []
    {this.state.investments.map( stock => {
        return (
            stockTags.push(stock.stockTag),
            this.setState({stockTags})
        )
    })}
  }

  //Get a price (test):
  getStocksPrices = () => {
    const key = require("./keys.js").stockKey;
    this.state.stockTags.map( i =>
        fetch("https://cloud.iexapis.com/stable/stock/" + i + "/quote?token=" + key)
        .then(res => res.json())
        .then(res => {
            const newPrice = res
            this.setState({
              stockPricesArr: this.state.stockPricesArr.concat(newPrice)
            })
        })
        .catch( error => console.error(error))
    )
  }




  render() {
    const { user } = this.props.auth;
    // console.log(this.state.user.user.id)

    // console.log(this.state.stockPrice)

    // console.log(this.state.investments)

    // let companyTags = this.state.stockTags
    // console.log(companyTags)

    //get price values for final array
    // let prices = this.state.stockPricesArr
    // console.log(prices)
    // console.log(this.state.stockTags)
    // let currentStocks = []


    // this.state.stockPricesArr.map(function({latestPrice}){
    //   return currentStocks.push(latestPrice)
    // })
    // console.log(currentStocks)


    // These are th two arrays of data:
    console.log(this.state.stockPricesArr)
    console.log(this.state.investments)

    let totalInvestmentPerCompany = []
    {this.state.investments.map( investment => {
      {this.state.stockPricesArr
        .filter(stockPrices => {
          return(stockPrices.symbol === `${investment.stockTag}`)
        })
        .map (stock => {
          return (
                totalInvestmentPerCompany.push(stock.latestPrice * investment.numberOfShares)
              )
            }
          )
        }
      }
    )}
    console.log(totalInvestmentPerCompany)

    const addTotalInvestments = array => array.reduce((a, b) => a + b, 0);
    var totalStockInvestment = addTotalInvestments(totalInvestmentPerCompany);
    console.log(totalStockInvestment.toFixed(2))

    const doughnutChart = {
      labels: this.state.stockTags,
      datasets: [
        {
          label: "Assets",
          backgroundColor: [
            "rgba(91,21,55,1)",
            "rgba(0,168,232,1)",
            "rgb(194, 168, 74)",
            "rgba(50,172,109,1)",
            "rgba(242,116,5,1)",
            "rgba(116,106,255,1)"
          ],
          borderColor: "rgba(27,121,106,1)",
          borderWidth:1,
          data: totalInvestmentPerCompany
        }
      ]
    }

    return (
      <div>
        <div className="category-container">
            <Link to="/dashboard" className="btn waves-effect waves-light hoverable" id="dashboard-back-button">Back To Dashboard</Link>
            <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
            </button>
            <h5 className="category-introduction">Here are your investments in the stock market, {user.name.split(" ")[0]}.</h5>
            <h6 className="category-introduction-small-text">Create and manage your stock investments to never lose track of your financial assets.</h6>
            <button onClick={this.handleOpenInvestmentForm} className="btn waves-effect waves-light hoverable" id="dashboard-back-button">
              Add An Investment
            </button>
        </div>
        { this.state.addInvestment ?
        <div className="category-container">
          <div className="row">
            <form className="col s12" onSubmit={this.handleInvestmentSubmit}>
              <div className="row">
                <div className="input-field col s4">
                  <input type="text" id="companyName" name="companyName" className="validate" onChange={this.handleChange}/>
                  <label htmlFor="category">Company Name</label>
                </div>
                <div className="input-field col s2">
                  <input type="text" id="stockTag" name="stockTag" className="validate" onChange={this.handleChange}/>
                  <label htmlFor="category">Stock Exchange Tag</label>
                </div>  
                <div className="input-field col s2">
                  <input type="text" id="numberOfShares" name="numberOfShares" className="validate" onChange={this.handleChange} />
                  <label htmlFor="amount">Number of Shares</label>
                </div>
                <input type="submit" className="btn" id="budget-form-button" value="Enter"/>
                <button onClick={this.handleCloseInvestmentForm} className="btn" id="budget-form-cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        :null }
        { this.state.editInvestment ?
        <div className="category-container">
          <div className="row">
            <form className="col s12" onSubmit={this.handleEditInvestmentSubmit}>
              <div className="row">
                <div className="input-field col s4">
                  <input type="text" id="companyName" name="companyName" className="validate" onChange={this.handleChange} value={this.state.companyName}/>
                </div> 
                <div className="input-field col s2">
                  <input type="text" id="stockTag" name="stockTag" className="validate" onChange={this.handleChange} value={this.state.stockTag}/>
                </div> 
                <div className="input-field col s2">
                  <input type="text" id="numberOfShares" name="numberOfShares" className="validate" onChange={this.handleChange} value={this.state.numberOfShares}/>
                </div>
                <input type="submit" className="btn" id="budget-form-button" value="Submit"/>
                <button onClick={this.handleCloseEditInvestmentForm} className="btn" id="budget-form-cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        :null }
        <div className="category-container" id="stocks-main-container">
        { this.state.investments.length === 0 ?
        <div className="no-budget-warning">
          <h5>You have not added any investments yet, {user.name.split(" ")[0]}.</h5>
          <h6>Add your stock investments to begin tracking your assets.</h6>
        </div>
        :null }
        { this.state.investments.length > 0 ?
        <div>
        <div className="stock-chart-parent">
          <div className="stocks-chart-container">
            <Doughnut
                data={doughnutChart}
                options={{
                  title:{
                    display:false,
                    text:'Monthly Recurring Bills Distribution',
                    fontSize:28
                  },
                  legend:{
                    display:'true',
                    position:'right',
                    labels: {
                      fontSize:18
                    }
                  },
                  tooltips:{
                    enabled:true,
                    backgroundColor:'#2f7a6a',
                    bodyFontSize:16
                  }
                }}
              />
          </div>
        </div>
        <div className="stock-assets-analysis-container">
          <h5 className="stock-assets-analysis-text">Currently, your total assets in the US stock market total ${parseFloat(totalStockInvestment.toFixed(2)).toLocaleString('en')}</h5>
        </div>
        <div className="stocks-list-container">
        {this.state.investments.map( investment => {
            return (
            <div className="stock-list-card">
                <div key={investment._id}>
                    <div>
                        <div className="stock-card-header">
                            <h5 className="stock-name">{investment.companyName}</h5>
                            <div className="stocks-button-container">
                                <button onClick={() => this.handleEditForm(investment)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="edit-budget-button">
                                    <i className="material-icons">mode_edit</i>
                                </button>
                                <button onClick={() => this.deleteInvestment(investment._id)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="trash-budget-button">
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="stock-info-main-container">
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">Exchange Symbol:</h5>
                            <h5 className="stock-info-value">{investment.stockTag}</h5>
                        </div>
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">Owned Shares:</h5>
                            <h5 className="stock-info-value">{investment.numberOfShares}</h5>
                        </div>
                        <div className="stock-info-div">
                          <h5 className="stock-info-title">*Current Price:</h5>
                          {this.state.stockPricesArr
                          .filter(stockPrices => {
                            return(stockPrices.symbol === `${investment.stockTag}`)
                          })
                          .map (stock => {
                            return (
                              <h5 className="stock-info-value">${parseFloat(stock.latestPrice.toFixed(2)).toLocaleString('en')}</h5>
                                )
                              }
                            )
                          }
                        </div>
                        <hr id="stocks-hr" />
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">Total {investment.companyName} Assets:</h5>
                            {this.state.stockPricesArr
                            .filter(stockPrices => {
                              return(stockPrices.symbol === `${investment.stockTag}`)
                            })
                            .map (stock => {
                              return (
                                <h5 className="stock-info-value">${parseFloat(stock.latestPrice * investment.numberOfShares).toLocaleString('en')}</h5>
                                  )
                                }
                              )
                            }
                        </div>
                    </div>
                </div>
            </div>
            )
        })}
        </div>
            <h5 className="stock-price-warning">*Stock prices are updated every fifteen minutes during trading days.</h5>
            <h5 className="stock-price-warning">*Live stock data provided by IEX Cloud.</h5>
        </div>
        :null }
        </div>
      </div>
    );
  }
}

Investments.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Investments);