import { useEffect, useState } from "react"
import { getAllRequests } from "../services/requests"

function ResolvedRequests() {
  const [requests, setRequests] = useState([])
    async function loadRequests() {
        try {
            const response = await getAllRequests()
            setRequests(response.requests ?? response)
        } catch (err) {
            console.log(err)
        }
    }
  useEffect(() => {
    loadRequests()
  }, [])

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved")

  return (
    <div>
      <h1>Resolved Requests</h1>

      {resolvedRequests.map((request) => {
        const finalReply =
          request.replies?.[request.replies.length - 1]

        return (
          <details key={request._id}>
            <summary>{request.title} — {request.priority}</summary>

            <p>
              <strong>Status:</strong> {request.status}
            </p>

            <p>
              <strong>Employee:</strong>{" "}
              {request.createdBy?.username || "Unknown"}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {request.category?.name || "Other"}
            </p>

            <h3>Request information</h3>

            {Object.entries(request.requestDetails || {}).map(
              ([name, value]) => (
                <p key={name}>
                  <strong>{name}:</strong> {value}
                </p>
              )
            )}

            <h3>Technician Final message: </h3>

            <p>
              {finalReply?.message || "No reply available"}
            </p>
          </details>
        );
      })}

      {resolvedRequests.length === 0 && (
        <p>There are no resolved requests.</p>
      )}
    </div>
  );
}

export default ResolvedRequests;