// import { useState,useEffect } from "react";
import RouteList from "./RouteList";
import NavBar from "./home/NavBar";
import useApp from "./appHooks/useApp";

function App() {
  useApp();

  return (
    <div id="App">
      <NavBar />
      <RouteList />
    </div>
  );
}

export default App;
