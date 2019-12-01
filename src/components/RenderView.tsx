import * as React from "react"
import Plot from "./Plot"
export class IPlotData{
  type : string
  x : any[]
  y : any[]
}

interface IRenderView {
  plotDatas : IPlotData[]
}
export default class RenderView extends React.Component<IRenderView>{
    render () {
        return (
            <div style={{
                display : 'block',
                width : '100%',
                height : '70%',
                overflow : "hidden",
                borderColor : "blue",
                borderWidth : "10px"
            }}>
              {
                this.props.plotDatas.map(plotData => <Plot dataJs={[
                  {
                    x: plotData.x,
                    y: plotData.y,
                    type: plotData.type
                  }
                ]} layout={{
                  width : 300,
                  height : 300,
                }}/>)
              }
                
            </div>
        )
    }
}