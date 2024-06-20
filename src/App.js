import './App.css';
import { Routes,Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/login';
import VerifyEmail from './pages/VerifyEmail';
function App() {
  return (
    <Routes>
      <Route path = "/" element= {<Home />} />
      <Route path = "/signup" element= {<Signup />} />
      <Route path = "/login" element= {<Login />} />
      <Route path = "/verifyEmail" element= {<VerifyEmail />} />
      
    </Routes>
  );
}

export default App;
