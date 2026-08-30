import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import {getOneRequest,addReply,updateRequestStatus} from "../services/requests";

function OneRequest() {
  const { requestId } = useParams();

  const [request, setRequest] = useState(null)
  const [comment, setComment] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [loading, setLoading] = useState(true)
    async function loadRequest() {
        try {
            const response = await getOneRequest(requestId)
            setRequest(response);
        } catch (err) {
            console.log(err);
            toast.error("Could not load the request")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadRequest()
    }, [requestId])

  async function handleResolved() {
    try {
    const updatedRequest = await updateRequestStatus(requestId,"Resolved")
    setRequest(updatedRequest)
      toast.success("Issue resolved successfully")
    } catch (err) {
      console.log(err.response?.data || err.message)
      toast.error("Could not update the request")
    }
  }

    async function handleNotResolved(event) {
        event.preventDefault();

        try {
            const response = await addReply(requestId, {
                message: comment
            });

            setRequest({
                ...request,
                status: "In progress",
                replies: response.replies
            });

            setComment("");
            setShowComment(false);

            toast.success("Your comment was sent to the technician");
        } catch (err) {
            console.log(err);
            toast.error("Could not send your comment");
        }
    }

  if (loading) {
    return <p>Loading request...</p>;
  }

  if (!request) {
    return <p>Request not found.</p>;
  }
  const subcategory = request.category?.subcategories?.find(
    (subcategory) =>subcategory._id.toString() === request.subcategoryId.toString())

  return (
    <div>
      <h1>{request.title}</h1>

      
      <section>
        <h2>Request Details</h2>

        <p>
          <strong>Priority:</strong> {request.priority}
        </p>

        <p>
          <strong>Status:</strong> {request.status}
        </p>

        {Object.entries(request.requestDetails || {}).map(([key, detail]) => (
          <div key={key}>
            <strong>{detail?.label || key}:</strong>{" "}
            {detail?.value ?? detail ?? "Not provided"}
          </div>
        ))}
      </section>

      
      <section>
        <h2>Messages</h2>

        {request.replies?.length === 0 && (
          <p>The technician has not replied yet.</p>
        )}

        {request.replies?.map((reply) => (
          <div key={reply._id}>
            <h3>
              {reply.sender?.role === "technician"
                ? "Technician"
                : "Employee"}
            </h3>

            <p>{reply.message}</p>
          </div>
        ))}
      </section>

      
      {request.status === "Waiting for confirmation" && (
        <section>
          <h2>Is your issue resolved?</h2>

          <button onClick={handleResolved}>
            Yes, issue resolved
          </button>

          <button onClick={() => setShowComment(true)}>
            No, I still need help
          </button>
        </section>
      )}

      
      {showComment && (
        <form onSubmit={handleNotResolved}>
          <label htmlFor="comment">
            Explain what is still not working:
          </label>

          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit">
            Send to technician
          </button>

          <button
            type="button"
            onClick={() => setShowComment(false)}
          >
            Cancel
          </button>
        </form>
      )}

      
      <section>
        <h2>Emergency Support</h2>

        <p>
          For urgent issues that stop critical work, call IT Support:
        </p>

        <a href="tel:+97312345678">
          +973 1234 5678
        </a>
      </section>
    </div>
  );
}

export default OneRequest;