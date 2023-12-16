import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Home, LogIn, Profile, Shop, SignUp, Project, Skill, Admin} from '@/pages';
import { Footer, Header, Navbar } from '@/layout';
import { PayPalDemo } from '@/pages/Payment';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login2 } from '@/pages';
import FindFreelancer from '@/pages/FindFreelancer/findFreelancer';
import Job from '@/pages/Job/job';
import { ProjectManagement } from '@/pages/ProjectManagement';
import { UpdateProject, NewProject } from '@/pages';
import BidPopup from '@/pages/Bid';
import { Bid } from '@/components';
const Routers = () => {
  return (
    <GoogleOAuthProvider clientId="138372560551-k6qucf4eebnppht116rieqoa6bfm801b.apps.googleusercontent.com">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/paypal-demo" element={<PayPalDemo />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/findfreelancer" element={<FindFreelancer/>} />
          <Route path="/job" element={<Job/>} />
          <Route path="/project-manage" element={<ProjectManagement/>} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/updateproject" element={<UpdateProject />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/admin" element={<Admin/>} />
            {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
};
export default Routers;
