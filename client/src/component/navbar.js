import React, {useContext} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {Navbar, NavItem, Icon} from 'react-materialize';


export const MyNavbar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = (e) => {
    e.preventDefault();
    auth.logout();
    history.push('/');
  }

  return (
    <>
    <Navbar
      alignLinks="left"
      brand={<a className="brand-logo right" href="/">InvestHelper</a>}
      id="mobile-nav"
      menuIcon={<Icon>menu</Icon>}
      options={{
        draggable: true,
        edge: 'left',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 200,
        preventScrolling: true
      }}
    >
      <NavItem>
        <NavLink to="/prediction" className="black-text">Прогноз</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/portfolio" className="black-text">Портфель</NavLink>
      </NavItem>
      <NavItem>
        <a className="black-text" href="/" onClick={logoutHandler}>Выйти</a>
      </NavItem>
    </Navbar>
    
    </>
  )
}