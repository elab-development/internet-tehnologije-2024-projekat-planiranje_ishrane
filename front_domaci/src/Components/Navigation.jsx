import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Navigation.css";

const menus = {
  admin: [
    { name: "Recepti", path: "/recepti" },
    { name: "Sastojci", path: "/sastojci" },
    { name: "Dodaj Recept", path: "/dodaj-recept" },
  ],
  user: [
    { name: "Svi recepti", path: "/recepti" },
    { name: "Moji planovi", path: "/planovi" },
    { name: "Moje liste", path: "/moje-liste" },
    { name: "Kreiraj plan", path: "/kreiraj-plan" },
    { name: "Omiljeni", path: "/omiljeni" },
  ],
  guest: [
    { name: "Svi recepti", path: "/recepti" },
    { name: "Prijava", path: "/" },
    { name: "Registracija", path: "/register" },
  ],
};

export default function Navigation() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("userRole") || "guest";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (role === "guest") {
    const leftLinks = [menus.guest[0]]; 
    const rightLinks = menus.guest.slice(1); 

    return (
      <nav className="navigation">
        <ul>
          {/* Leva grupa */}
          {leftLinks.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {name}
              </NavLink>
            </li>
          ))}

         
          <div className="right-group">
            {rightLinks.map(({ name, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </div>
        </ul>
      </nav>
    );
  }

   return (
    <nav className="navigation">
      <ul>
        {menus[role].map(({ name, path }) => (
          <li key={name}>
            <NavLink
              to={path}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {name}
            </NavLink>
          </li>
        ))}

        <li className="logout-wrapper">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
