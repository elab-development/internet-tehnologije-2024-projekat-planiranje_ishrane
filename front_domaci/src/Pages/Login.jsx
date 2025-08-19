import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("userRole", "admin");
      sessionStorage.setItem("username", username);
      navigate("/recepti"); 
    } else if (username === "user" && password === "user123") {
      sessionStorage.setItem("userRole", "user");
      sessionStorage.setItem("username", username);
      navigate("/recepti"); 
    } else {
      alert("Unesite validne kredencijale!");
    }
  };

  const handleGuestLogin = () => {
    sessionStorage.setItem("userRole", "guest");
    sessionStorage.setItem("username", "Gost");
    navigate("/recepti");
  };

  return (
    <div className="login-container">
      <h2>Prijava</h2>

      <input
        type="text"
        placeholder="Korisničko ime"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Prijavi se</button>

      <button
        onClick={() => {
          navigate("/register");
        }}
        className="secondary-btn"
      >
        Registruj se
      </button>

      <button onClick={handleGuestLogin} className="guest-btn">
        Prijavi se kao gost
      </button>
    </div>
  );
}
