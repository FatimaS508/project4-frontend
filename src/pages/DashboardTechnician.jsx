import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllRequests } from "../services/requests";

function DashboardTechnician() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadRequests() {
    try {
      const response = await getAllRequests()
      setRequests(response.requests ?? response)
    } catch (err) {
      console.log(err)
      setError("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, []);

  const newRequests = requests.filter(
    (request) => request.status === "New"
  )

  const resolvedRequests = requests.filter((request) => request.status === "Resolved"
  )

  const activeRequests = requests.filter(
    (request) =>
      request.status !== "New" &&
      request.status !== "Resolved"
  )

  const groupedRequests = {}

  for (const request of newRequests) {
    const categoryName = request.category?.name || "Other Requests"

    const subcategoryId = request.subcategoryId
    const subcategoryName = request.title

    if (!groupedRequests[categoryName]) {
      groupedRequests[categoryName] = {}
    }

    if (!groupedRequests[categoryName][subcategoryId]) {
      groupedRequests[categoryName][subcategoryId] = {
        id: subcategoryId,
        name: subcategoryName,
        count: 0,
      };
    }

    groupedRequests[categoryName][subcategoryId].count++
  }

  if (loading) {
    return (
      <main className="technician-dashboard-page">
        <p className="technician-page-message">
          Loading requests...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="technician-dashboard-page">
        <p className="technician-page-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="technician-dashboard-page">
      <header className="technician-heading">
        <p>IT Support Center</p>
        <h1>Technician Dashboard</h1>

      </header>

      <section className="technician-summary-grid">
        <article className="technician-summary-card">
          <div className="summary-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18H6z" />
              <path d="M9 8h6" />
              <path d="M9 12h6" />
              <path d="M9 16h4" />
            </svg>
          </div>

          <div className="summary-content" id="new-requests">
            <span>New Requests</span>
            <strong>{newRequests.length}</strong>
            <p>Waiting for technician review</p>
            <a href="#new-requests" className="new-requests-scroll">
              <span>View below</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="m7 14 5 5 5-5" />
              </svg>
            </a>
          </div>
        </article>

        <Link
          to="/requests2/active"
          className="technician-summary-card"
        >
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>
            </div>

            <div className="summary-content">
              <span>Active Requests</span>
              <strong>{activeRequests.length}</strong>
              <p>Currently receiving support</p>
            </div>

            <svg
              className="summary-arrow"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m14 7 5 5-5 5" />
            </svg>
          </Link>


        <Link
          className="technician-summary-card resolved-summary"
          to="/requests2/resolved"
        >
          <div className="summary-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
          </div>

          <div className="summary-content">
            <span>Resolved</span>
            <strong>{resolvedRequests.length}</strong>
            <p>View completed requests</p>
          </div>

          <svg
            className="summary-arrow"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m14 7 5 5-5 5" />
          </svg>
        </Link>
      </section>

      <section className="technician-requests-section">
        <div className="technician-section-heading">
          <div>
            <p>Request Categories</p>
            <h2>New Requests</h2>
          </div>

          <span>{newRequests.length} total</span>
        </div>

        {newRequests.length > 0 ? (
          <div className="technician-category-grid">
            {Object.entries(groupedRequests).map(([categoryName, subcategories], index) => (
                <article
                  className="technician-category-card"
                  key={categoryName}
                >
                  <span className="technician-card-decoration">
                  </span>

                  <div className="technician-category-header">
                    <span className="technician-category-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{categoryName}</h3>
                  </div>

                  <div className="technician-subcategory-list">
                    {Object.values(subcategories).map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/requests2/subcategory/${subcategory.id}`}
                          className="technician-subcategory-link"
                        >
                          <span>{subcategory.name}</span>

                          <strong className="technician-request-count">
                            {subcategory.count}
                          </strong>
                        </Link>
                      )
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="technician-empty-state">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>

            <h2>No new requests</h2>
            <p>You have reviewed all current support requests.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardTechnician;