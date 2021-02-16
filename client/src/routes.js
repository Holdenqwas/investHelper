import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Prediction} from './pages/PredictionPage';
import {Portfolio} from './pages/PortfolioPage.js';
import {AuthPage} from './pages/AuthPage';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/prediction" exact>
          <Prediction />
        </Route>
        <Route path="/portfolio" exact>
          <Portfolio />
        </Route>
        <Redirect to="/prediction" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}