import React, { Component } from "react";
import Login from "./components/login";
import Main from "./components/main";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Snackbar from "material-ui/Snackbar";
import "typeface-roboto";
import Api from './api';
import { path } from "ramda";
import mobileCheck from "./utils/mobilecheck";
import appDefaultState from "./constants/appDefaultState";
import { Router, Route, Switch } from "react-router";
import mainComponent from "./components/main";
import createHistory from "history/createBrowserHistory";
import ShowGraph from './components/showGraph';

const history = createHistory();
const getStorage = () => (mobileCheck() ? localStorage : sessionStorage);

const PropsRoute = ({ component, ...rest }) => {
      const Component = component;
      return (
            <Route
                  {...rest}
                  render={routeProps => {
                        console.log(routeProps);
                        return <Component {...rest} />;
                  }}
            />
      );
};

class App extends Component {
      constructor(props) {
            super(props);
            const cid = getStorage().getItem("cid");
            const userName = getStorage().getItem("userName");
            const loginMessage = getStorage().getItem("loginMessage");

            this.state = {
                  errorState: {
                        errorOpen: false,
                        fetchErrorMsg: "nastala chyba",
                        autoHideDuration: 3000
                  },
                  graph: {}
            };
            this.api = new Api(this._apiErrorCallback);
      }
      _apiErrorCallback = e => {
            let duration = 3000;
            if (e.message === "Černoch zablokoval náš server :'(") duration = 999999;
            this.setState({
                  errorState: {
                        fetchErrorMsg: e.message,
                        errorOpen: true,
                        autoHideDuration: duration
                  }
            });
      };

      _closeError = () => {
            this.setState({ errorState: { errorOpen: false } });
      };

      loadGraphData = (id, sensor, targetTime) => {
            let time = targetTime;
            const d = new Date();
            d.setHours(d.getHours() - 1);
            if (!time) time = d;
            console.log("time", time)
            this.api.showGraph(id, sensor, time).then((json) => this.setState({graph: {...json}}))
      }
      render() {
            const {
                  graph
            } = this.state;
            return (
                  <MuiThemeProvider>
                        <div>
                              <Router history={history}>
                                    <Switch>
                                          <PropsRoute
                                                path="/showGraph"
                                                component={ShowGraph}
                                                handleError={this._apiErrorCallback}
                                                state={graph}
                                                loadGraphData={this.loadGraphData}
                                          />
                                          <PropsRoute
                                                path="/"
                                                component={mainComponent}
                                                handleError={this._apiErrorCallback}
                                          />
                                           
                                    </Switch>
                              </Router>
                              <Snackbar
                                    open={this.state.errorState.errorOpen}
                                    message={this.state.errorState.fetchErrorMsg}
                                    autoHideDuration={this.state.errorState.autoHideDuration}
                                    action="Zavřít"
                                    onActionClick={this._closeError}
                              />
                        </div>
                  </MuiThemeProvider>
            );
      }
}

export default App;
