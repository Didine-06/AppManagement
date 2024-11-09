import { BarChart, LayoutDashboard } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { Link, useLocation } from "react-router-dom";  // Import useLocation
import { useAuth } from "../../Context/UserContext";

export default function Sidemenu() {
  const location = useLocation();  // Récupérer le chemin actuel
  
  const { isLoggedIn} = useAuth();

  
  

  return (
    <Sidebar>
      <Link to={'/'}>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={location.pathname === '/'}  // Activer si on est sur la page "/"
        />
      </Link>

      {
        isLoggedIn ? (
          <Link to={'/Students'}>
        <SidebarItem
          icon={<BarChart size={20} />}
          text="Students"
          active={location.pathname === '/Students'}  // Activer si on est sur "/importStudents"
        />
      </Link>
        ): (
          <>
          </>
        )
      }
    </Sidebar>
  );
}
