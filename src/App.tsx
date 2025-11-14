import RouteList from "./RouteList";
import NavBar from "./home/NavBar";
import LoadingLarge from "./LoadingLarge";
import LoadingSmall from "./LoadingSmall";
import useApp from "./appHooks/useApp";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./styles/App.scss";

function App() {
  useApp();

  return (
    <div id="App">
      <SkeletonTheme
        enableAnimation
        baseColor="#646665"
        highlightColor="#f0f0f0"
        borderRadius={50}
      >
        <NavBar />
        <LoadingLarge />
        <LoadingSmall />
        <ToastContainer
          position="top-right"
          newestOnTop={true}
          closeOnClick={true}
          hideProgressBar
          pauseOnFocusLoss
        />
        <RouteList />
      </SkeletonTheme>
    </div>
  );
}

export default App;
