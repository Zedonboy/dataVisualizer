import * as React from "react";
import RenderView, { IPlotData } from "./RenderView";
import Console from "./Console";
export default class App extends React.Component {
  state = {
    plotData : []
  }

  constructor(props) {
    super(props);
    this.onNewChart = this.onNewChart.bind(this)
    this.clearCharts = this.clearCharts.bind(this)
  }

  render() {
    return (
      <div className="container">
        <RenderView plotDatas={this.state.plotData}/>
        <Console onCreateChart={this.onNewChart} onClear={this.clearCharts}/>
      </div>
    )
  }

  onNewChart(pd : IPlotData) {
    this.setState((state, prop) => {
      //@ts-ignore
      state.plotData.push(pd)
      //@ts-ignore
      return state.plotData
    })
  }

  clearCharts () {
    this.setState({
      plotData : []
    })
  }
}
