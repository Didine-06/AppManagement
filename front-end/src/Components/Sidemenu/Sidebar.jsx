import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useContext, createContext, useState, useRef, useEffect, Profiler } from "react";
import MainContent from "../../Layout/MainContent";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useAuth } from "../../Context/UserContext";

const SidebarContext = createContext();

export default function Layout({ children }) {


  const { isLoggedIn, setIsLoggedIn, user } = useAuth();

  const [expanded, setExpanded] = useState();
  const [isMobile, setIsMobile] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const userProfil = {
    avatar: `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user.name}+${user.prenom}`,
  };

  useEffect(() => {
    const handleResize = () => {
      const isBelow760px = window.innerWidth <= 760;
      setIsMobile(isBelow760px);
      if (isBelow760px) {
        setExpanded(false); // Réduit le menu pour les écrans sous 760px
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Appel initial pour définir l'état en fonction de la taille actuelle

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  function logout() {
    api.post('/logout')
      .then(() => {
        window.localStorage.removeItem('ACCESS_TOKEN');
        setIsLoggedIn(false);
        setShowMenu(false);
        navigate('/login');
      })
      .catch(error => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  }

  useEffect(() => {
    const tokenCheck = () => setIsLoggedIn(!!window.localStorage.getItem("ACCESS_TOKEN"));

    // Listen for changes in local storage
    window.addEventListener("storage", tokenCheck);
    return () => window.removeEventListener("storage", tokenCheck);
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-auto md:w-auto">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm ">
          <div className="p-4 pb-2 flex justify-between items-center">
            {expanded && (
              <>
                <svg id="logo-35" width="40" height="39" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" fill="#007AFF"></path>
                  <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" fill="#312ECB"></path>
                </svg>
                <h1 className="font-bold italic tracking-widest text-blue-900">AppManagement</h1>
              </>
            )}
            <button onClick={() => !isMobile && setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="p-4 border-t relative">
            {isLoggedIn ? (
              <div className="flex items-center" >
                <img src={userProfil.avatar} alt="Avatar" className="w-10 h-10 rounded-md" onClick={() => setShowMenu((prev) => !prev)} />
                <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                  <h4 className="font-semibold">{user.name} {user.prenom} </h4>
                  <button onClick={() => setShowMenu((prev) => !prev)} className="ml-3">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            ) : (
              expanded && !isMobile ? (
                <div className="flex space-x-4">
                  <Link to={"/Login"}>
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
                      Login
                    </button>
                  </Link>
                  <Link to={"/Register"}>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                      Register
                    </button>
                  </Link>
                </div>
              ) : (



                <SidebarContext.Provider value={{ expanded }}>
                  <ul className="flex-1 ">
                    <Link to={'/login'}>
                      <SidebarItem
                        icon={<LogIn size={20} />}
                        text="Login"
                        active={location.pathname === '/login'}  // Activer si on est sur la page "/"
                      />
                    </Link>
                    <Link to={'/register'}>
                      <SidebarItem
                        icon={<UserPlus size={20} />}
                        text="SignUp"
                        active={location.pathname === '/register'}  // Activer si on est sur la page "/"
                      />
                    </Link>
                  </ul>
                </SidebarContext.Provider>



              )
            )}

            {showMenu && (
              <div ref={menuRef} className="absolute -right-24 bottom-full mb-2 py-2 w-36 bg-white border rounded-lg shadow-lg">
              <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  <div className="flex justify-between">
                      Profile <User className="ml-2 h-6 w-6"/> {/* Taille 1.5rem x 1.5rem */}
                  </div>
              </a>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                  <div className="flex justify-between">
                      Logout <LogOut className="ml-2 h-6 w-6"/> {/* Taille 1.5rem x 1.5rem */}
                  </div>
              </button>
          </div>
          

            )}
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <MainContent />
        </div>
      </main>
    </div>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active
        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
        : "hover:bg-indigo-50 text-gray-600"
        }`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
        />
      )}

      {!expanded && (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {text}
        </div>
      )}
    </li>
  );
}


