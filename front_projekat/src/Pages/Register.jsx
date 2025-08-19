import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css"; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        ime_prezime: username,
        email: email,
        password: password,
        
      });

      if (response.data.success) {
        localStorage.setItem("auth_token", response.data.access_token);
        navigate("/");
      } else {
        setError("Greška pri registraciji: " + JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error("Greška pri registraciji:", err);
      setError("Došlo je do greške prilikom registracije. Pokušajte ponovo.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Registracija</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Potvrdi lozinku"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

        

          <button type="submit">Registruj se</button>
        </form>

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
