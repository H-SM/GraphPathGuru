import Home from "./components/Home"
import Details from "./components/Details"

function App() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", fontWeight: "bold", fontSize: "22px", marginTop: "22px" }}>
        GM_LoneWolf
      </div>
      <div>
        <Home />
        <Details />
      </div>

    </>
  );
}

export default App;
