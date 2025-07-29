import RouteList from "./RouteList";
import NavBar from "./home/NavBar";
import LoadingLarge from "./LoadingLarge";
import LoadingSmall from "./LoadingSmall";
import useApp from "./appHooks/useApp";
import "./styles/App.scss";

function App() {
  useApp();

  return (
    <div id="App">
      <NavBar />
      <LoadingLarge />
      <LoadingSmall />
      <RouteList />
    </div>
  );
}

export default App;
