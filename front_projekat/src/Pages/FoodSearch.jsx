import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/FoodSearch.css";
import Pagination from "../Components/Pagination";
import Navigation from "../Components/Navigation";
export default function FoodSearch() {
  const [foods, setFoods] = useState([]);
  const [query, setQuery] = useState("doritos");
  const [dataType, setDataType] = useState([]);
  const [brandOwner, setBrandOwner] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 12;

  const fetchFoods = async (page = 1) => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_API_KEY;

      const response = await axios.get(
        "https://api.nal.usda.gov/fdc/v1/foods/search",
        {
          params: {
            query,
            dataType: dataType.length ? dataType.join(",") : "Branded,Foundation",
            brandOwner: brandOwner || undefined,
            pageSize,
            pageNumber: page,
            sortBy: "dataType.keyword",
            sortOrder: "asc",
            api_key: apiKey,
          },
        }
      );

      const foodsArr = response.data.foods || [];
      const totalHits = response.data.totalHits || 0;

      setFoods(foodsArr);
      setTotalPages(Math.max(1, Math.ceil(totalHits / pageSize)));
      setCurrentPage(page);
    } catch (error) {
      console.error("Greška prilikom dohvatanja podataka:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchFoods(page);
  };

  useEffect(() => {
    fetchFoods(1);
 
  }, [query, dataType, brandOwner]);

  const handleCheckboxChange = (value) => {
    setDataType((prev) =>
      prev.includes(value) ? prev.filter((dt) => dt !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setDataType([]);
    setBrandOwner("");
    setQuery("");
    fetchFoods(1);
  };

 
  const formatIngredients = (ingredients) => {
    if (!ingredients) return [];
    const regex = /,(?![^(]*\))/g; 
    return ingredients
      .toLowerCase()
      .split(regex)
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0);
  };

  return (
    <>
    <Navigation/>
    <div className="home-container">
      <div className="content-wrapper">
      
        <aside className="sidebar">
        

          <div className="filters-container">
            <div className="filter-group">
              <strong>Tip podataka</strong>
              <label>
                <input
                  type="checkbox"
                  checked={dataType.includes("Branded")}
                  onChange={() => handleCheckboxChange("Branded")}
                />
                Branded
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={dataType.includes("Foundation")}
                  onChange={() => handleCheckboxChange("Foundation")}
                />
                Foundation
              </label>
            </div>

            <div className="filter-group">
              <strong>Proizvođač</strong>
              <input
                type="text"
                value={brandOwner}
                onChange={(e) => setBrandOwner(e.target.value)}
                placeholder="npr. Koka Kola"
              />
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              Resetuj filtere
            </button>
          </div>
        </aside>

      
        <main className="main-content">
              <input
            type="text"
            className="search-input"
            placeholder="Pretraži hranu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading ? (
            <p>Učitavanje...</p>
          ) : (
            <>
              <div className="recipes-list">
                {foods.length > 0 ? (
                  foods.map((food) => (
                    <div
                      key={food.fdcId}
                      className="recipe-card"
                      onClick={() => {
                        setSelectedFood(food);
                        setIsModalOpen(true);
                      }}
                    >
                      <h3>{food.description}</h3>
                      <p>
                        <strong>Tip:</strong> {food.dataType}
                      </p>
                      {food.brandOwner && (
                        <p>
                          <strong>Proizvođač:</strong> {food.brandOwner}
                        </p>
                        
                      )}
                     
                      {food.foodNutrients && food.foodNutrients.length > 0 && (
                        <div className="nutrients-list">
                          <h4>Nutrijenti:</h4>
                          <ul>
                            {food.foodNutrients.map((nutrient) => (
                              <li key={nutrient.nutrientId}>
                                {nutrient.nutrientName}: {nutrient.value}{" "}
                                {nutrient.unitName}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Nema rezultata za prikaz.</p>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>

    
      {isModalOpen && selectedFood && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedFood.description}</h2>
            <h4>Sastojci:</h4>
            <ul>
              {formatIngredients(selectedFood.ingredients).map((ing, idx) => (
                <li key={idx}>{idx + 1}. {ing}</li>
              ))}
            </ul>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Zatvori</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
