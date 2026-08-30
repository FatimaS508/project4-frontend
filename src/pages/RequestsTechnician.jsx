import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getAllRequests } from "../services/requests";

function RequestsTechnician() {
  const { subcategoryId } = useParams()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

async function loadRequests() {
      try {
        const response = await getAllRequests()
        const allRequests = response.requests ?? response

        const subcategoryRequests = allRequests.filter((request) => request.subcategoryId?.toString() === subcategoryId?.toString()
        )
        setRequests(subcategoryRequests)
      } catch (err) {
        console.log(err)
        setError("Failed to load requests")
      } finally {
        setLoading(false)
      }
    }
  useEffect(() => {
    loadRequests()
  }, [subcategoryId])

  function formatDate(date) {
    if (!date) {return "Not available"
    }
    return new Date(date).toLocaleDateString()
  }

  if (loading) { return (
      <main className="technician-requests-page">
        <p className="technician-requests-message">
          Loading requests...
        </p>
      </main>)}

  if (error) { return ( <main className="technician-requests-page">
        <p className="technician-requests-error">
          {error}
        </p>
      </main>
    )
  }

  const pageTitle = requests.length > 0? requests[0].title
      : "Subcategory Requests"

  return (<main className="technician-requests-page">
      <Link className="technician-requests-back" to="/dashboard2"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Dashboard
      </Link>

      <header className="technician-requests-heading">
        <p>Support Queue</p>
        <h1>{pageTitle}</h1>

        <span>
          Review and respond to employee support requests.
        </span>
      </header>

      <div className="technician-requests-count">
        <span>Requests</span>
        <strong>{requests.length}</strong>
      </div>

      {requests.length === 0 ? (
        <div className="technician-requests-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3h12v18H6z" />
            <path d="M9 8h6" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
          </svg>

          <h2>No requests found</h2>

          <p>
            There are no requests for this subcategory.
          </p>

          <Link to="/dashboard2"> Return to Dashboard </Link>
        </div>
      ) : (
        <section className="technician-table-card">
          <div className="technician-table-wrapper">
            <table className="technician-requests-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>
                    <span className="screen-reader-text">
                      Action
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td data-label="Employee">
                      <div className="employee-information">
                        <span className="employee-avatar">
                          {request.createdBy?.username?.charAt(0).toUpperCase() || "?"}
                        </span>
                        <strong>
                          {request.createdBy?.username || "Unknown"}
                        </strong>
                      </div>
                    </td>

                    <td data-label="Title">
                      {request.title}
                    </td>
                    <td data-label="Priority">
                      <span className={`technician-priority-badge priority-${request.priority?.toLowerCase()}`}>
                        {request.priority}
                      </span>
                    </td>

                    <td data-label="Status">
                      <span className="technician-status-badge"> {request.status}</span>
                    </td>

                    <td data-label="Created"> {formatDate(request.createdAt)}
                    </td>

                    <td data-label="Action">
                      <Link
                        className="technician-view-request"
                        to={`/requests2/${request._id}`}
                      >
                        View Request
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="m14 7 5 5-5 5" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default RequestsTechnician;