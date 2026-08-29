import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllRequests } from "../services/requests";

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter((request) =>
    request.title?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await getAllRequests();
        setRequests(response);
      } catch (err) {
        console.log(err);
      }
    }

    loadRequests();
  }, []);

  return (
    <div>
      <h1>All Requests</h1>

      <input
        type="text"
        placeholder="Search support requests"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredRequests.map((request) => (
        <div key={request._id}>
          <h2>{request.title}</h2>

          <p>Priority: {request.priority}</p>
          <p>Status: {request.status}</p>

          <Link to={`/requests/${request._id}`}>
            View Request
          </Link>
        </div>
      ))}

      {filteredRequests.length === 0 && <p>No requests found.</p>}
    </div>
  );
}

export default AllRequests;