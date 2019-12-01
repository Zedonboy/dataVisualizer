import * as React from "react"
import * as createPlotlyComponent from "react-plotly.js/factory"
import { DataTypes } from "../types/types";
//@ts-ignore
const plotly = createPlotlyComponent.default(Plotly);
interface IPlot{
    dataJs ?: any[]
    layout ?: object
    className ?: string
}
export default class Plot extends React.Component<IPlot>{
    render () {
        return (
            React.createElement(plotly, {
                data: this.props.dataJs, 
                layout : this.props.layout
            })
        )
    }
}