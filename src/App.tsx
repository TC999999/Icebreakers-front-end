import RouteList from "./RouteList";
import NavBar from "./home/NavBar";
import LoadingLarge from "./LoadingLarge";
import LoadingSmall from "./LoadingSmall";
import useApp from "./appHooks/useApp";

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
