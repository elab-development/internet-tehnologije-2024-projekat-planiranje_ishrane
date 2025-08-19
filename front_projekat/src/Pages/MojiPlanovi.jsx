
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/MojiPlanovi.css";
import Navigation from "../Components/Navigation.jsx";
import Pagination from "../Components/Pagination.jsx";
import axios from "axios";

export default function MojiPlanovi() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/planovi-obroka?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setPlans(response.data.data);
        setTotalPages(response.data.last_page || 1); 
      }
    } catch (err) {
      console.error("Greška pri učitavanju planova:", err);
      setPlans([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage]);

  const otvoriPlan = (plan) => {
    navigate(`/plan/${plan.id}`);
  };

  return (
    <>
      <Navigation />
      <div className="moji-planovi-container">
        <h1>Moji Planovi</h1>
        {loading ? (
          <p>Učitavanje...</p>
        ) : plans.length === 0 ? (
          <p>Nema planova.</p>
        ) : (
          <div className="planovi-lista">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="plan-kartica"
                onClick={() => otvoriPlan(plan)}
              >
                <h2>{plan.naziv_plana}</h2>
                <p>
                  <strong>Period:</strong> {plan.period}
                </p>
                <p>
                  <strong>Broj recepata:</strong> {plan.recepti.length}
                </p>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
