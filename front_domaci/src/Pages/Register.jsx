import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css"; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Lozinke se ne poklapaju!");
      return;
    }
    console.log("Registrovan korisnik:", username);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Registracija</h2>

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

        <input
          type="password"
          placeholder="Potvrdi lozinku"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Registruj se</button>

        <button
          onClick={() => navigate("/")}
          className="secondary-btn"
        >
          Prijavi se
        </button>
      </div>
    </div>
  );
}
