
import * as React from 'react';
import { lazy, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

const Home = lazy(() => import(/* webpackChunkName: 'Home' */ '@pages/Home'));

const GlobalStyle = createGlobalStyle`
html, body, #root {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(20, 20, 20);
  color: whitesmoke;
}`;

function App() {
  return <>
    <GlobalStyle />
    <MemoryRouter>
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Suspense>
    </MemoryRouter>
  </>;
}

export default App;