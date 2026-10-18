import { AuthProvider, useAuthContext } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Venues from './pages/Venues.jsx';
import MyRegistrations from './pages/MyRegistrations.jsx';
import WaitingList from './pages/WaitingList.jsx';
import Attendance from './pages/Attendance.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageEvents from './pages/admin/ManageEvents.jsx';
import ManageBookings from './pages/admin/ManageBookings.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageVenues from './pages/admin/ManageVenues.jsx';
import ManageWaitingList from './pages/admin/ManageWaitingList.jsx';
import CrowdAnalytics from './pages/admin/CrowdAnalytics.jsx';
import AttendanceManagement from './pages/admin/AttendanceManagement.jsx';
import Footer from './components/Footer.jsx';
import './App.css';
function RouteContent() {
 const { isAdmin } = useAuthContext();
 const path = window.location.pathname.replace(/\/$/, '') || '/';
 if(path==='/login') return <Login/>;
 if(path==='/register') return <Register/>;
 if(path==='/events') return <Events/>;
 if(path.startsWith('/events/')) return <EventDetails/>;
 if(path==='/venues') return <Venues/>;
 if(path==='/registrations') return <MyRegistrations/>;
 if(path==='/waiting-list') return <WaitingList/>;
 if(path==='/attendance') return <Attendance/>;
 if(path.startsWith('/admin')) {
   if(!isAdmin) return <main className="page-shell"><h1>Admin access required</h1><p>Please sign in with an administrator account.</p></main>;
   if(path==='/admin/events') return <ManageEvents/>;
   if(path==='/admin/bookings') return <ManageBookings/>;
   if(path==='/admin/users') return <ManageUsers/>;
   if(path==='/admin/venues') return <ManageVenues/>;
   if(path==='/admin/waiting-list') return <ManageWaitingList/>;
   if(path==='/admin/analytics') return <CrowdAnalytics/>;
   if(path==='/admin/attendance') return <AttendanceManagement/>;
   return <AdminDashboard/>;
 }
 return <Home/>;
}
export default function App() {
 return <AuthProvider><div className="app"><Navbar/><RouteContent/><Footer/></div></AuthProvider>;
}
