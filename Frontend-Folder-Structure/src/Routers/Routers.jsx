import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Home, LogIn, Profile, Shop, SignUp, Project, FindFreelancer, Job, AboutUs} from '@/pages';
import { Footer, Header, Navbar } from '@/layout';
import { PayPalDemo } from '@/pages/Payment';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login2 } from '@/pages';
import { PostDetail } from '@/pages/FreelancerPost';
// import { AboutUs } from '@/pages/About';
// import CreateFreelancerPost from '@/pages/FindFreelancer/createFreelancerPost';
// import UpdateFreelancerPost from '@/pages/FindFreelancer/updateFreelancerPost';
// import FindFreelancer from '@/pages/FindFreelancer/findFreelancer';
import { ProjectManagement } from '@/pages/ProjectManagement';
import { UpdateProject, NewProject, Skill, Admin } from '@/pages';

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
          <Route path="/myprofile/:id"  element={<Profile access_token={localStorage.getItem('AUTH_TOKEN')} />} />


          <Route path="/project-manage/:id" element={<ProjectManagement own={false}/>} />
          <Route path="/my-project-manage/:id" element={<ProjectManagement own={true}/>} />
          <Route path="/project-manage" element={<ProjectManagement own={false}/>} />
          <Route path="/my-project-manage" element={<ProjectManagement own={true}/>} />


          {/* <Route path="/profile/updateAvatar/:id" element={<UpdateAvatarForm />} /> */}
          <Route path="/project" element={<Project />} />
          <Route path="/project/:id" element={<Project />} />



          <Route path="/skill" element={<Skill />} />
          <Route path="/updateproject" element={<UpdateProject />} />
          <Route path="/newproject" element={<NewProject />} />


          <Route path="/admin" element={<Admin/>} />

          {/* <Route path="/profile/updateAvatar/:id" element={<UpdateAvatarForm />} /> */}

          
  
          <Route path="/findfreelancer" element={<FindFreelancer/>} />
          <Route path="/findFreelancer/:id" element={<PostDetail />} />

         
          {/* <Route path="/createFreelancerPost" element={<CreateFreelancerPost />} /> */}
          {/* <Route path="/updateFreelancerPost/:id" element={<UpdateFreelancerPost />} /> */}

          <Route path="/job" element={<Job />} />


          <Route path='/aboutUs'  element={<AboutUs />} />


          <Route path="/paypal-demo" element={<PayPalDemo />} />
        </Routes>
        <Footer />
      </Router>
    </GoogleOAuthProvider>
  );
};
export default Routers;
