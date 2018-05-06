import React, { Component } from "react";
import { Card, CardText, CardTitle } from "material-ui";
import Api from "../api";
import { map, keys } from "ramda";
import { Link } from "react-router-dom";

class Main extends Component {
      constructor(props) {
            super(props);
            this.state = {};
            console.log(props);
            this.api = new Api(props.handleError);
      }
      componentWillMount() {
            this.api.initState().then(json => this.setState(json));
      }
      _renderCard = item => {
            const id = item._id;
            const text = it => {
                  if (it === "created") {
                        const d = new Date(item.data[0][it]);
                        const string =
                              d.getDate() +
                              ". " +
                              (d.getMonth() + 1) +
                              ". " +
                              d.getHours() +
                              ":" +
                              ("0" + d.getMinutes()).slice(-2);
                        return (
                              <a>
                                    <p className="updateName">Aktualizace {string}</p>
                              </a>
                        );
                  }
                  return (
                        <Link to={"showGraph?id=" + id + "&sensor=" + it} className="sensorName">
                              <span>
                                    {it} = {item.data[0][it].value} {item.data[0][it].unit}
                              </span>
                        </Link>
                  );
            };
            return (
                  <Card className="container">
                        <CardTitle title={item.title} className="center" />
                        <CardText>
                              {
                                    //<p>{item.body}</p>
                              }
                              {map(text, keys(item.data[0]))}
                        </CardText>
                  </Card>
            );
      };

      _renderCards = docs => {
            const a = keys(docs[0].body.data);
            return map(this._renderCard, docs);
      };
      render() {
            const { docs } = this.state;
            return <div>{docs && this._renderCards(docs)}</div>;
      }
}

export default Main;
