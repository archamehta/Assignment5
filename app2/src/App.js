import React, { Component } from "react";
import "./App.css";
import BarChart from "./BarChart";
import CorrelationMatrix from "./CorrelationMatrix";
import Scatterplot from "./Scatterplot";
import * as d3 from "d3";
import tips from "./tips.csv";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // Initialize data state
      selectedXVariable: "total_bill",
      selectedYVariable: "tip",
    };
  }

  componentDidMount() {
    var self = this;
    d3.csv(tips, function (d) {
      return {
        tip: parseFloat(d.tip),
        total_bill: parseFloat(d.total_bill),
        size: parseInt(d.size) // Parse size to integer
      };
    })
      .then(function (csv_data) {
        self.setState({ data: csv_data }); // Store data in state
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  handleXVariableChange = (e) => {
    this.setState({ selectedXVariable: e.target.value });
  };

  handleYVariableChange = (e) => {
    this.setState({ selectedYVariable: e.target.value });
  };

  render() {
    const { data, selectedXVariable, selectedYVariable } = this.state;
    return (
      <div className="container">
        <div className="header">
          <h1>Dashboard</h1>
          <div className="dropdowns">
            <label>X Variable:</label>
            <select
              value={selectedXVariable}
              onChange={this.handleXVariableChange}
            >
              <option value="total_bill">Total Bill</option>
              <option value="tip">Tip</option>
              <option value="size">Size</option> {/* Add size option */}
              {/* Add more options for other variables */}
            </select>
            <label>Y Variable:</label>
            <select
              value={selectedYVariable}
              onChange={this.handleYVariableChange}
            >
              <option value="tip">Tip</option>
              <option value="total_bill">Total Bill</option>
              <option value="size">Size</option> {/* Add size option */}
              {/* Add more options for other variables */}
            </select>
          </div>
        </div>
        <div className="charts">
          <div className="chart">
            <h2>Bar Chart</h2>
            <BarChart
              data={data}
              xVariable={selectedXVariable}
              yVariable={selectedYVariable}
            />
          </div>
          <div className="chart">
            <h2>Scatterplot</h2>
            <Scatterplot
              data={data}
              xVariable={selectedXVariable}
              yVariable={selectedYVariable}
            />
          </div>
          <div className="chart">
            <h2>Correlation Matrix</h2>
            <CorrelationMatrix rawData={data} /> {/* Pass data as rawData prop */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
