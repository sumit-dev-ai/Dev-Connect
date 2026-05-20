import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,

} from "../ui/sidebar"
import logo from '../../assets/ui/logo.png'
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  User2,
  ChevronDown,
} from "lucide-react"

import { Link, useNavigate } from "react-router-dom"

import useAuthContext from "@/context/authContext"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { logoutUser } from "@/services/AuthServices"
import toast from "react-hot-toast"

export function AppSidebar() {
  const { user , setUser } = useAuthContext();
  const navigate = useNavigate();

  //handle logout
  const handleLogOut = async(e) => {
    e.stopPropagation();
    try {
      const data = await logoutUser();

      if(data.statusCode===200){
        toast.success(data?.message)
        setUser(null);
        navigate("/");
        
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log(user)
  return (
    <Sidebar collapsible="icon">

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>

              <Link to="/">
                <img src={logo} alt="" className="w-fit h-16" />
              </Link>
            </SidebarMenuButton>



          </SidebarMenuItem>
        </SidebarMenu>


      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupLabel>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Explore */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/explore">
                    <Compass />
                    <span>Explore</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Notifications */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/notifications">
                    <Bell />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Messages */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/messages">
                    <MessageSquare />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Explore */}


            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>


              <div onClick={()=>navigate("/profile")} className="cursor-pointer">
                {(<Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>) ||
                  <User2 />}
                  <span>{user?.userName || "User"}</span> 
                <button type="button" className="button-devconnect" onClick={handleLogOut}>log out</button>

              </div>
              {/* <Link to="/profile">
                {(<Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>) ||
                  <User2 />}
                  <span>{user?.userName || "User"}</span> 
              </Link> */}
                  
                  
                
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}