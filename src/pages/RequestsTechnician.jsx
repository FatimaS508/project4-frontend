import React from 'react'
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getAllRequests } from "../services/requests";

function RequestsTechnician() {
  const { subcategoryId } = useParams();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await getAllRequests();

        const allRequests = response.requests ?? response;

        const subcategoryRequests = allRequests.filter(
          (request) =>
            request.subcategoryId === subcategoryId
        );

        setRequests(subcategoryRequests);
      } catch (err) {
        console.log(err);
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [subcategoryId]);

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <main>
      <Link to="/dashboard2">Back to dashboard</Link>

      <h1>
        {requests.length > 0
          ? requests[0].title
          : "Subcategory Requests"}
      </h1>

      {requests.length === 0 ? (
        <p>No requests found for this subcategory.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>
                  {request.createdBy?.username || "Unknown"}
                </td>

                <td>{request.title}</td>

                <td>{request.priority}</td>

                <td>{request.Status}</td>

                <td>
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <Link to={`/requests2/${request._id}`}>
                    View request
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>

    </div>
  )
}

export default RequestsTechnician