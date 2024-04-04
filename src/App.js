import './App.css';
import Auth from './components/auth/Auth';
import { Routes, Route } from "react-router-dom";
import ListsPage from './components/lists/ListsPage';

function App() {
  return (
    <div className="App">
    <Routes>
				<Route path="/" element={<Auth />}></Route>
        
				<Route path="/lists" element={<ListsPage/>}></Route>
		</Routes> 

    </div>
  );
}

export default App;
