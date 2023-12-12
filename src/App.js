import logo from "./logo.svg";
import "./App.css";
import Menu from "./components/menu/Menu";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import SubHome from "./components/subhome/SubHome";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/SubHome" element={<SubHome />} />
      </Routes>
    </div>
  );
}

export default App;
