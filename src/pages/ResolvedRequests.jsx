import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllRequests } from "../services/requests";

function ResolvedRequests() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchNumber, setSearchNumber] = useState("")

  async function loadRequests() {
    try {
      const response = await getAllRequests()
      setRequests(response.requests ?? response)
    } catch (err) {
      console.log(err)
      setError("Could not load resolved requests.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, []);

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved"
  )
  const filteredResolvedRequests = resolvedRequests.filter((request) => { const searchValue = searchNumber.trim().replace("#", "")
  return String(request.requestNumber || "").includes(searchValue)
})

  function displayValue(value) {
    if (value === null || value === undefined || value === "") {
      return "Not provided"
    }

    if (typeof value === "object") {return value.value || value.name || "Not provided"
    }

    return value
  }

  if (loading) {
    return (
      <main className="resolved-requests-page">
        <p className="resolved-page-message">
          Loading resolved requests...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="resolved-requests-page">
        <p className="resolved-page-error">{error}</p>
      </main>
    )}
  return (
    <main className="resolved-requests-page">
      <button
        className="resolved-back-button"
        type="button"
        onClick={() => navigate(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      <header className="resolved-page-heading">
        <p>Request Archive</p>
        <h1>Resolved Requests</h1>
        <span>
          Review completed requests and their final technician responses
        </span>
      </header>

      <div className="resolved-count">
        <span>Resolved</span>
        <strong>{resolvedRequests.length}</strong>
      </div>
      <div className="request-number-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 5 5" />
        </svg>

        <input type="text" value={searchNumber} onChange={(event) => setSearchNumber(event.target.value)} placeholder="Search by request number"/>

        {searchNumber && (<button
            type="button"
            onClick={() => setSearchNumber("")}
            aria-label="Clear search"
          > × </button>)}
      </div>
      {resolvedRequests.length > 0 ? ( <section className="resolved-requests-list">
          {filteredResolvedRequests.map((request, index) => {
            const subcategory = request.category?.subcategories?.find((item) =>
                  item._id?.toString() === request.subcategoryId?.toString())

            const fields = subcategory?.formFields || subcategory?.fields || []

            const finalReply = request.replies?.[request.replies.length - 1]
            

            return (
              
              <details className="resolved-request-card"
                key={request._id}
              >
                <summary>
                  <div className="resolved-request-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="resolved-summary-content">
                    <h2>{request.title}</h2>

                    <div className="resolved-summary-badges">
                      <span className="resolved-priority">
                        {request.priority}
                      </span>

                      <span className="resolved-status">
                        Resolved
                      </span>
                      <span className="resolved-status">
                        Request no.: {request.requestNumber}
                      </span>
                    </div>
                  </div>

                  <svg
                    className="resolved-chevron"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>

                <div className="resolved-card-body">
                  <section className="resolved-information">
                    <div className="resolved-section-heading">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M6 3h12v18H6z" />
                        <path d="M9 8h6" />
                        <path d="M9 12h6" />
                        <path d="M9 16h4" />
                      </svg>

                      <h3>Request Information</h3>
                    </div>

                    <div className="resolved-details-grid">
                      {Object.entries(request.requestDetails || {}).map(([key, value]) => {const field = fields.find(
                          (item) => item.name === key || item.label === key
                        )

                        return (
                          <div
                            className="resolved-detail-item"
                            key={key}
                          >
                            <span>
                              {value?.label || field?.label || key}
                            </span>

                            <strong> {displayValue(value)}
                            </strong>
                          </div>)})}
                    </div>
                  </section>

                  <section className="final-message-card">
                    <div className="final-message-heading">
                      <div className="technician-message-icon">
                        T
                      </div>

                      <div>
                        <span>Technician</span>
                        <h3>Final Message</h3>
                      </div>
                    </div>

                    <p>
                      {finalReply?.message || "No reply available"}
                    </p>
                  </section>
                </div>
              </details>
            );
          })}
        </section>
      ) : (
        <div className="resolved-empty-state">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 3 3 5-6" />
          </svg>

          <h2>No resolved requests</h2>

          <p>
            Completed support requests will appear here.
          </p>
        </div>
      )}
    </main>
  );
}

export default ResolvedRequests;