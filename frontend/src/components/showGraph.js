import React, { Component } from "react";
import { Card, CardText, CardTitle } from "material-ui";
import Api from "../api";
import { map, keys } from "ramda";
import { Link } from "react-router-dom";
import getQueryVariable from "../utils/getQueryVariable";
import drawGraph from "../utils/drawGraph";
import mobileCheck from '../utils/mobilecheck'

const convertTime = today => item => {
      const time = new Date(item);
      if (time < today) {
            return (
                  time.getDate() +
                  ". " +
                  (time.getMonth() + 1) +
                  ". " +
                  time.getHours() +
                  ":" +
                  ("0" + time.getMinutes()).slice(-2)
            );
      } else {
            return time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2);
      }
};
const getTimeMinus = (hours) => {
      const time = new Date();
      time.setHours(time.getHours() - hours)
      return time;
}
class ShowGraph extends Component {
      constructor(props) {
            super(props);
            this.state = {};
            console.log(props);
            this.api = new Api(props.handleError);
      }
      componentWillMount() {
            console.log(this.props);
            const { location } = this.props;
            this.id = getQueryVariable("id", location.search);
            this.sensor = getQueryVariable("sensor", location.search);
            const targetTime = getQueryVariable("targetTime", location.search);
            this.props.loadGraphData(this.id, this.sensor, targetTime);
      }
      _renewData = targetTime => {
                   this.props.loadGraphData(this.id, this.sensor, targetTime);
      };
      render() {
            const { data, labels } = this.props.state;
            if (data && labels) {
                  const canvas = document.querySelector(".ctx");
                  const today = new Date();
                  today.setDate(today.getDate() - 1);
                  const convert = convertTime(today);
                  const newLabels = map(convert, labels);

                  console.log(newLabels);
                  drawGraph(data, newLabels, canvas);
            }
            return (
                  <div>
                        <p className="graphName">{this.sensor}</p>
                        <canvas className="ctx" />
                        <div className="timeLine">
                              <span className="absoluteLine" />
                              {!mobileCheck() && <div className="montBefore" onClick={() => this._renewData(getTimeMinus(30*24))}>
                                    <span>měsíc</span>
                              </div>}
                              {!mobileCheck() && <div className="10daysBefore" onClick={() => this._renewData(getTimeMinus(240))}>
                                    <span>10 dní</span>
                              </div>}
                              {!mobileCheck() && <div className="3daysBefore" onClick={() => this._renewData(getTimeMinus(24*3))}>
                                    <span>3 dny</span>
                              </div>}
                              <div className="dayBefore " onClick={() => this._renewData(getTimeMinus(24))}>
                                    <span>den</span>
                              </div>
                              <div className="12hoursBefore" onClick={() => this._renewData(getTimeMinus(12))}>
                                    <span>12 hodin</span> 
                              </div>
                              <div className="6hoursBefore" onClick={() => this._renewData(getTimeMinus(6))}>
                                    <span>6 hodin</span>
                              </div>
                              <div className="now" onClick={() => this._renewData(getTimeMinus(1))}>
                                    <span>nyní</span>
                              </div>
                        </div>
                  </div>
            );
      }
}

export default ShowGraph;
