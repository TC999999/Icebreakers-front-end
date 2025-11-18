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

// renders entire app
function App() {
  useApp();

  return (
    <div id="App">
      {/* allows for skeleton loaders to have themes */}
      <SkeletonTheme
        enableAnimation
        baseColor="#646665"
        highlightColor="#f0f0f0"
        borderRadius={50}
      >
        {/* navbar is universal component: should always appear in app */}
        <NavBar />
        {/* loading screen for refresh renders: solid grey background */}
        <LoadingLarge />
        {/* loading screen for submitting forms or loading data on page changes: 
         transparent grey background*/}
        <LoadingSmall />
        {/* allows toast notifications to pop up when needed */}
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
