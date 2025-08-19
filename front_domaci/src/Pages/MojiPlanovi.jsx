import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import planovi from "../Data/Obroci.jsx";
import "../Styles/MojiPlanovi.css";
import Navigation from "../Components/Navigation.jsx";
import Pagination from "../Components/Pagination.jsx"; 

const PLANS_PER_PAGE = 9; 

export default function MojiPlanovi() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const otvoriPlan = (plan) => {
    navigate(`/plan/${plan.id}`);
  };

  const totalPages = Math.ceil(planovi.length / PLANS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLANS_PER_PAGE;
  const currentPlans = planovi.slice(startIndex, startIndex + PLANS_PER_PAGE);

  return (
    <>
      <Navigation />
      <div className="moji-planovi-container">
        <h1>Moji Planovi</h1>
        <div className="planovi-lista">
          {currentPlans.length === 0 ? (
            <p>Nema planova.</p>
          ) : (
            currentPlans.map((plan) => (
              <div
                key={plan.id}
                className="plan-kartica"
                onClick={() => otvoriPlan(plan)}
              >
                <h2>{plan.naziv_plana}</h2>
                <p><strong>Period:</strong> {plan.period}</p>
                <p><strong>Broj recepata:</strong> {plan.recepti.length}</p>
              </div>
            ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
