import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllRequests } from "../services/requests";
import { Funnel } from 'lucide-react';

function ActiveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  

  async function loadActiveRequests() {
    try {
      const response = await getAllRequests()
      const allRequests = response.requests ?? response;

      const filteredRequests = allRequests.filter(
        (request) => request.status !== "New" && request.status !== "Resolved"
      )


      setRequests(filteredRequests);
    } catch (err) {
      console.log(err)
      setError("Failed to load active requests")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActiveRequests()
  }, [])
    const sortedRequests = [...requests].sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }

        return new Date(a.createdAt) - new Date(b.createdAt)
    })

  if (loading) {
    return (
      <main className="technician-requests-page">
        <p className="technician-page-message">
          Loading active requests...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="technician-requests-page">
        <p className="technician-page-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="technician-requests-page">
      <header className="technician-heading">
        <p>IT Support Center</p>
        <h1>Active Requests</h1>
        <span>
          View requests that are currently receiving support.
        </span>
      </header>

      <section className="technician-requests-section">
        <div className="technician-section-heading">
          <div>
            <p>Support Workload</p>
          </div>

                  <div className="active-requests-controls">
                      <div className="date-filter-wrapper">
                          <Funnel className="filter-icon" />

                          <select
                              value={sortOrder}
                              onChange={(event) => setSortOrder(event.target.value)}
                              className="date-filter"
                          >
                              <option value="newest">Newest First</option>
                              <option value="oldest">Oldest First</option>
                          </select>
                      </div>

                      <span className="requests-total">
                          {requests.length} total
                      </span>
                  </div>
        </div>

        {requests.length > 0 ? (
          <div className="requests-table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Request</th>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {sortedRequests.map((request) => (
                  <tr key={request._id}>
                        <td>
                            {request.requestNumber
                                ? `#${request.requestNumber}`
                                : " "}
                        </td>
                    <td>{request.title}</td>

                    <td>
                      {request.createdBy?.username || "Unknown employee"}
                    </td>
                    <td>
                        {request.createdBy?.employeeId || " "}
                    </td>

                     <td>
                        {request.createdBy?.department || " "}
                    </td>

                    <td>{request.priority}</td>
                    <td>
                            {new Date(request.createdAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </td>

                    <td>{request.status}</td>


                    <td>
                      <Link
                        to={`/requests2/${request._id}`}
                        className="view-request-link"
                      >
                        View Request
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="technician-empty-state">
            <h2>No active requests</h2>
            <p>You currently have no requests receiving support.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default ActiveRequests;