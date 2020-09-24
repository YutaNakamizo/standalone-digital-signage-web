import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Config } from '~/routes/Config';
import { Display } from '~/routes/Display';
import { Top } from '~/routes/Top';

export const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/config" render={props => (
          <Config
            {...props}
          />
        )} />
        <Route exact path="/display" render={props => (
          <Display
            {...props}
          />
        )} />
        <Route path="/" render={props => (
          <Top
            {...props}
          />
        )} />
      </Switch>
    </div>
  );
};

