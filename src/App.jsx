import { Routes, Route } from 'react-router-dom';
import NavBar from './components/organism/Navbar'
import Home from './pages/Home'
{/*import CreateUser from './pages/CreateUser'
import Login from './pages/LogIn'
import AgendarCita from './pages/Agendar-Cita'*/}
import CreateUser from './pages/CreateUser'

function App() {
 return (
   <>
     <NavBar />
     <Routes>
       <Route path="/" element={<Home />} />
       {/*<Route path="/crear-usuario" element={<CreateUser />} />
       <Route path="/iniciar-sesion" element={<LogIn />} />
       <Route path="/agendar-cita" element={<AgendarCita />} />*/}
       <Route path="/CreateUser" element={<CreateUser />} />
     </Routes>
   </>
 );
}


export default App;
