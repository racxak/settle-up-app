import "./App.css";
import Auth from "./components/auth/Auth";
import { Routes, Route } from "react-router-dom";
import ListsPage from "./components/lists/ListsPage";
import SingleList from "./components/SingleList";
import { AuthProvider } from "./contexts/authContext";

function App() {
	const token = localStorage.getItem("token")
	return (
		<div className="App">
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Auth />}></Route>
					<Route path="/list/:id" element={token ? <SingleList /> : <Auth/>} />
					<Route path="/lists" element={token ? <ListsPage /> : <Auth/>}></Route>
				</Routes>
			</AuthProvider>
		</div>
	);
}

export default App;
