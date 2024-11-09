import { RouterProvider } from 'react-router-dom'

import { router } from './Router/index.jsx'
import "./index.css"
import { AuthProvider } from './Context/UserContext.jsx'




function App() {



  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

    </>
  )
}

export default App
