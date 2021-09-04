import { FC } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Project, Home } from "./pages";

import "./App.scss";

const App: FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Project />
          </Route>
          <Route path="/project">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
