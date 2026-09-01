import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllRequests } from "../services/requests";
import { Funnel } from 'lucide-react';

function AllRequests() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter]= useState('Newest')

  const filteredRequests = requests.filter((request) => request.title?.toLowerCase().includes(search.trim().toLowerCase())
    && (statusFilter === "All" || request.status === statusFilter))
  .sort((a,b)=>{
    if(dateFilter === "Newest"){
      return new Date(b.createdAt)- new Date(a.createdAt)
    }else{
      return new Date(a.createdAt)- new Date(b.createdAt)
    }
  })
    

  async function loadRequests() {
    try {
      const response = await getAllRequests()
      setRequests(response)
    } catch (err) {
      setError("Could not load your requests.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadRequests()
  }, [])

  return (
    <main className="all-requests-page">
      <header className="requests-heading">
        <p>Support History</p>
        <h1>All Requests</h1>
      </header>
      <div className="filter-search"></div>{/*check this*/ }
      <div className="filter-title">
        <Funnel size={22} />
        <p>Filter by</p>
      </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="filtering" >
          
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Waiting for confirmation"> Waiting for Confirmation</option>
          <option value="Resolved">Resolved</option>
        </select>
        
      <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="filtering">
        <option value="Newest">Newest First</option>
        <option value="Oldest">Oldest First</option>
      </select>

      <div className="request-search-container">
        <svg
          className="request-search-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 5 5" />
        </svg>

        <input type="text"
          placeholder="Search support requests"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {search && (<button className="clear-search-button"
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

      </div>

      {loading && (
        <p className="requests-page-message"> Loading requests...</p>
      )}

      {error && (<p className="requests-page-error">{error}</p>)}

      {!loading && !error && filteredRequests.length > 0 && (
        <section className="requests-list">
          {filteredRequests.map((request, index) => (
            <article
              className="request-list-card"
              key={request._id}
            >
              <div className="request-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="request-card-content">
                <h2>{request.title}</h2>

                <div className="request-card-details">
                  <p>
                    <span>Priority</span>

                    <strong className={`priority-badge priority-${request.priority?.toLowerCase()}`}
                    >
                      {request.priority}
                    </strong>
                  </p>

                  <p>
                    <span>Status</span>

                    <strong className="status-badge">
                      {request.status}
                    </strong>
                  </p>
                </div>
              </div>

              <Link className="view-request-link"
                to={`/requests/${request._id}`}
              >
                View Request

                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m14 7 5 5-5 5" />
                </svg>
              </Link>
            </article>
          ))}
        </section>
      )}

      {!loading && !error && filteredRequests.length === 0 && (
          <div className="empty-requests">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18H6z" />
              <path d="M9 8h6" />
              <path d="M9 12h6" />
              <path d="M9 16h4" />
            </svg>

            <h2>No requests found</h2>

            <p>{search? `No request matches “${search}”.`
                : "You have not submitted any support requests yet."}
            </p>

            {search && (<button
                type="button"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
    </main>
  );
}

export default AllRequests;