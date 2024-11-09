import {createBrowserRouter} from 'react-router-dom'
import Home from '../pages/Home.jsx'

import Layout from '../Layout/Layout.jsx'
import Students from '../pages/Students.jsx'

import UserLayout from '../Layout/UserLayout.jsx'
import Login from '../pages/Login.jsx'

export const router  = createBrowserRouter([
    
    {
        element: <Layout/>,
        children : [
            {
                path:'/',
                element: <Home/>
            },
            {
                path:'/Login',
                element:<Login/>
            },
        ]
    },
    {
        element: <UserLayout/>,
        children : [
            {
                path:'/Students',
                element: <Students/>
            },
        ]
    }

    
])