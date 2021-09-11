// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DataPage from './pages/DataPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
        <Route path="/" exact component={DataPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
