import Routers from './Routers/Routers';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Project from './pages/ProjectPost/projectPost';
import { AuthProvider, useAuth } from './AuthContext';




function App() {
  const initialOptions = {
    clientId:
      'AadvtuhlBaRav1YVav2ERuNZa_70rjR4OEMm2p1A1MOmSGGRKD-YVErNXjBXGOWLM56qySteKDfbMjek',
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <AuthProvider>
      <PayPalScriptProvider options={initialOptions}>
        <Routers />
      </PayPalScriptProvider>
    </AuthProvider>
  );
}

export default App;
