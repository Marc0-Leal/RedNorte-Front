import { Routes, Route } from 'react-router-dom';
import NavBar from './components/organism/Navbar'
import Home from './pages/Home'
import CreateUser from './pages/CreateUser'
import LogIn from './pages/LogIn'
import AgendarCita from './pages/Agendar-Cita'

import TusCitas from './pages/Citas'

function App() {
 return (
   <>
     <NavBar />
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/CreateUser" element={<CreateUser />} />
       <Route path="/LogIn" element={<LogIn />} />
       <Route path="/iniciar-sesion" element={<LogIn />} />
       <Route path="/agendar-cita" element={<AgendarCita />} />
       <Route path="/tus-citas" element={<TusCitas />} />
     </Routes>
   </>
 );
}


export default App;
