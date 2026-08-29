import React from 'react'
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllRequests } from "../services/requests";

function DashboardTechnician() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadRequests() {
    try {
      const response = await getAllRequests();
      setRequests(response.requests ?? response);
    } catch (err) {
      console.log(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadRequests();
  }, []);

  const newRequests = requests.filter(
    (request) => request.status === "New"
  );

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved"
  )

  const groupedRequests = {};

  for (const request of newRequests) {
    const categoryName =
      request.category?.name || "Other Requests";

    const subcategoryId = request.subcategoryId;
    const subcategoryName = request.title;

    if (!groupedRequests[categoryName]) {
      groupedRequests[categoryName] = {};
    }

    if (!groupedRequests[categoryName][subcategoryId]) {
      groupedRequests[categoryName][subcategoryId] = {
        id: subcategoryId,
        name: subcategoryName,
        count: 0
      };
    }

    groupedRequests[categoryName][subcategoryId].count++;
  }

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <main className="technician-dashboard">
      <h1>Technician Dashboard</h1>

      <section className="request-summary">
        <div className="summary-card">
          <h2>New Requests</h2>
          <p>You have {newRequests.length} new requests</p>
        </div>

        <div className="summary-card">
          <h2>Resolved</h2>
          <p>{resolvedRequests.length} requests</p>
        </div>
      </section>

      <section className="category-grid">
        {Object.entries(groupedRequests).map(
          ([categoryName, subcategories]) => (
            <div className="category-card" key={categoryName}>
              <h2>{categoryName}</h2>

              {Object.values(subcategories).map((subcategory) => (
                <Link
                  key={subcategory.id}
                  to={`/requests2/subcategory/${subcategory.id}`}
                  className="subcategory-link"
                >
                  <span>{subcategory.name}</span>

                  <span className="request-count">
                    {subcategory.count}
                  </span>
                </Link>
              ))}
            </div>
          )
        )}
      </section>

      {newRequests.length === 0 && (
        <p>There are no new requests.</p>
      )}
    </main>

    </div>
  )
}

export default DashboardTechnician