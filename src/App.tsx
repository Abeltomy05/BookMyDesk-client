import { BrowserRouter,Route,Routes } from "react-router-dom"
import {Toaster} from 'react-hot-toast'
import ClientRoutes from "./routes/ClientRoutes"
import AdminRoutes from "./routes/AdminRoutes"
import VendorRoutes from "./routes/VendorRoutes"

function App() {


  return (
    <>
     <BrowserRouter>
        <Toaster
        position='top-center' reverseOrder={false} toastOptions={{duration:3000, style:{  background: '#333',color: '#fff',borderRadius: '8px'}}}/>

        <Routes>
          <Route path="/*" element={<ClientRoutes/>}/>
          <Route path="/vendor/*" element={<VendorRoutes/>}/>
          <Route path="/admin/*" element={<AdminRoutes/>}/>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
