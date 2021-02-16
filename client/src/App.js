import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from './routes';
import {useAuth} from './hooks/auth.hook';
import {AuthContext} from './context/AuthContext';
import {MyNavbar} from './component/navbar';
import {Loader} from './component/loader';
import 'materialize-css';


function App() {

  const {token, login, logout, userId, ready} = useAuth();

  const isAuthenticated = Boolean(token);
  const routes = useRoutes(isAuthenticated);


  if (!ready) {
    return <Loader/>
  };

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <Router>
        { isAuthenticated && <MyNavbar /> }
        <div>
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;