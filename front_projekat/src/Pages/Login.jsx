import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email,
        password: password,
      });

      if (response.data.success === true) {
        sessionStorage.setItem("auth_token", response.data.access_token);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("user_id", response.data.data.id);
        navigate("/recepti");
      } else {
        setErrorMessage("Pogrešan email ili lozinka.");
      }
    } catch (error) {
      console.error("Greška pri prijavi:", error);
      setErrorMessage("Došlo je do greške. Molimo pokušajte ponovo.");
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: "gost@gmail.com",
        password: "gost1234",
      });

      if (response.data.success === true) {
        sessionStorage.setItem("auth_token", response.data.access_token);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("user_id", response.data.data.id);
        navigate("/recepti");
      } else {
        setErrorMessage("Neuspešna prijava gosta.");
      }
    } catch (error) {
      console.error("Greška pri prijavi gosta:", error);
      setErrorMessage("Došlo je do greške pri prijavi gosta.");
    }
  };

  return (
    <div className="login-container">
      <h2>Prijava</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Prijavi se</button>

      <button
        onClick={() => navigate("/register")}
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
