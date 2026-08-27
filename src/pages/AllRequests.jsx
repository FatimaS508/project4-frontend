import { useEffect, useState } from "react";
import { getAllRequests } from "../services/requests";

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');

  const filteredRequests= requests.filter(R=> R.title?.toLowerCase().includes(search.toLowerCase()))

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
      
    <input
      type="text"
      placeholder="Search for support Request"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
      <h1>All Requests</h1>

          {filteredRequests.map((request) => (
              <div key={request._id}>
                  <h2>{request.title}</h2>

                  <p>Priority: {request.priority}</p>
                  <p>Status: {request.Status}</p>
                  <p>Details</p>

                  {Object.entries(request.requestDetails).map(([name, value]) => (
                      <p key={name}> {name}: {value}</p> 
                      ))} </div>))}
    </div>
  );
}

export default AllRequests;