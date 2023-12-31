import React, { useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { Home } from './home/Home';
import { Profile } from './profile/Profile';
import { Leaderboards } from './leaderboards/LeaderBoards';
import { AddAscent } from './add-ascent/AddAscent';


function App() {
  let user = localStorage.getItem("user");
  const [isIndex, setIsIndex] = React.useState(window.location.pathname === '/');

  return (
    <BrowserRouter>
      <body class="bg-dark" data-bs-theme="dark">
        <Header>
          {!user ? <NavLink to='/'>Login</NavLink> : <></>}
          {user ? <NavLink to='/profile'>Profile</NavLink> : <></>}
          {user ? <NavLink to='/leaderboards'>Leaderboards</NavLink> : <></>}
        </Header>

        <main class="container-fluid bg-image" style={{ padding: '0' }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/leaderboards' element={<Leaderboards />} />
            <Route path='/add-ascent' element={<AddAscent />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          {!isIndex ? <Footer /> : <></>}
        </main>

        {isIndex ? <Footer /> : <></>}
      </body>
    </BrowserRouter>
  );
}

function Header(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <h1>Climber's Crag</h1>
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {React.Children.map(props.children, (child, index) => {
              return (
                <li className="nav-item" key={index}>
                  {React.cloneElement(child, { className: 'nav-link' })}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}


function Footer() {
  const [isIndex, setIsIndex] = React.useState(window.location.pathname === '/');

  function renderFooter() {
    if (isIndex) {
      return (
        <div className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-muted-top">
          <div className="col-md-4 d-flex align-items-center" style={{ paddingLeft: '1em' }}>
            <a href="https://github.com/maxgollaher/startup" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
              <span className="mb-3 mb-md-0 text-light">Github Repo</span>
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <footer class="align-end">
          <div class="box bg-dark mb-0">
            <p class="text-muted">&copy; 2023 Climber's Crag, Inc. All rights reserved.</p>
          </div>
        </footer>
      );
    }
  }

  return (
    <>
      {renderFooter()}
    </>
  );
}

function NotFound() {

  useEffect(() => {
    const main = document.querySelector("main");
    main.classList.add("d-grid");
  }, []);


  return (
    <div className='container grid-rows'>
      <div className="box box-v-center">
        <h1>404: Page Not Found</h1>
      </div>
    </div>
  );
}

export default App;
