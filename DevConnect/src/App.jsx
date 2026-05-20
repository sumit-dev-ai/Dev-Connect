import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./components/layout/AppLayout"
import { Home } from '../src/pages/Home'
import { Messages } from '../src/pages/Messages'
import { Explore } from '../src/pages/Explore'
import { Notifications } from '../src/pages/Notifications'
import { PostDetails } from '../src/pages/PostDetails'
import { Profile } from '../src/pages/Profile'
import { CreatePost } from "./pages/CreatePost"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "react-hot-toast"
import EditProfilePage from "./components/profile/EditProfilePage"



function App() {
  const router = createBrowserRouter([
     {
    path: "/login",
    element: <Login />
  },

  {
    path: "/sign-up",
    element: <SignUp />
  },
    {
      path: '/',
      element: (<ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>

      ),
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "explore",
          element: <Explore />
        },
        {
          path: "messages",
          element: <Messages />
        },
        {
          path: "notifications",
          element: <Notifications />
        },
        {
          path: "post/:id",
          element: <PostDetails />
        },
        {
          path: "profile",
          element: <Profile />
        },
        {
          path: "create-post",
          element: <CreatePost />
        },
        {
          path: "editprofile",
          element: <EditProfilePage />
        },

      ]
    }

  ])
  return <>
  <RouterProvider router={router} />
  <Toaster position="top-center" />
  </>
}

export default App
