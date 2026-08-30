import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import {getOneRequest,addReply,updateRequestStatus,} from "../services/requests";


function OneRequest() {
  const { requestId } = useParams()
  const navigate = useNavigate()

  const [request, setRequest] = useState(null)
  const [comment, setComment] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)

  async function loadRequest() {
    try {
      const response = await getOneRequest(requestId)
      setRequest(response)
    } catch (err) {
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
      setResolving(true)

      const updatedRequest = await updateRequestStatus(requestId,"Resolved")

      setRequest(updatedRequest)
      toast.success("Issue resolved successfully",{duration: 4000})
    } catch (err) {
      console.log(err.response?.data || err.message)
      toast.error("Could not update the request")
    } finally {
      setResolving(false)
    }
  }

  async function handleNotResolved(event) {
    event.preventDefault()

    try {
      setSendingComment(true)

      const response = await addReply(requestId, { message: comment,})

      setRequest((currentRequest) => ({...currentRequest,status: "In progress",replies: response.request.replies}))
      setComment("")
      setShowComment(false)
      toast.success("Your message was sent. Please wait for the technician's reply.",{duration: 4000})
    } catch (err) {
      console.log(err)
      toast.error("Could not send your comment");
    } finally {
      setSendingComment(false)
    }
  }

  function displayDetail(detail) {
    if (detail === null || detail === undefined || detail === "") {
      return "Not provided"
    }

    if (typeof detail === "object") {
      return detail.value || detail.name || "Not provided"
    }

    return detail
  }

  if (loading) {
    return (
      <main className="one-request-page">
        <p className="one-request-message">
          Loading request...
        </p>
      </main>
    )
  }

  if (!request) {
    return (
      <main className="one-request-page">
        <p className="one-request-error">
          Request not found.
        </p>

        <button
          className="one-request-back"
          type="button"
          onClick={() => navigate("/requests")}
        >
          Back to Requests
        </button>
      </main>
    )
  }

  return (
    <main className="one-request-page">
      <button
        className="one-request-back"
        type="button"
        onClick={() => navigate(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>

        Back
      </button>

      <header className="one-request-heading">
        <p>Support Request</p>
        <h1>{request.title}</h1>

        <div className="request-heading-badges">
          <span className="heading-priority">
            Priority: {request.priority}
          </span>

          <span className="heading-status">
            Status: {request.status}
          </span>
        </div>
      </header>

      <div className="request-page-layout">
        <div className="request-main-column">
          <section className="request-information-card">
            <div className="section-heading">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3h12v18H6z" />
                <path d="M9 8h6" />
                <path d="M9 12h6" />
                <path d="M9 16h4" />
              </svg>

              <h2>Request Details</h2>
            </div>

            <div className="request-details-grid">
              <div className="request-detail-item">
                <span>Priority</span>
                <strong>{request.priority}</strong>
              </div>

              <div className="request-detail-item">
                <span>Status</span>
                <strong>{request.status}</strong>
              </div>

              {Object.entries(request.requestDetails || {}).map(([key, detail]) => (
                <div
                  className="request-detail-item"
                  key={key}
                >
                  <span>{detail?.label || key}</span>
                  <strong>{displayDetail(detail)}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className="request-messages-card">
            <div className="section-heading">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>

              <h2>Messages</h2>
            </div>

            <div className="request-messages-list">
              {!request.replies?.length && (
                <p className="no-replies-message">
                  The technician has not replied yet.
                </p>
              )}

              {request.replies?.map((reply) => {
                const isTechnician = reply.sender?.role === "technician"

                return (
                  <article
                    className={`reply-message ${
                      isTechnician? "technician-reply"
                        : "employee-reply"
                    }`}
                    key={reply._id}>
                    <div className="reply-sender">
                      <span className="sender-avatar">
                        {isTechnician ? "T" : "E"}
                      </span>

                      <h3>
                        {isTechnician? "Technician"
                          : "Employee"}
                      </h3>
                    </div>

                    <p>{reply.message}</p>
                  </article>
                );
              })}
            </div>
          </section>

          {request.status === "Waiting for confirmation" && (
            <section className="resolution-card">
              <div className="resolution-icon">?</div>

              <div className="resolution-content">
                <h2>Is your issue resolved?</h2>

                <p>
                  Please confirm whether the technician’s
                  solution fixed your issue.
                </p>
              </div>

              <div className="resolution-actions">
                <button
                  className="resolved-button"
                  type="button"
                  onClick={handleResolved}
                  disabled={resolving}
                >
                  {resolving? "Updating..."
                    : "Yes, issue resolved"}
                </button>

                <button
                  className="not-resolved-button"
                  type="button"
                  onClick={() => setShowComment(true)}
                  disabled={resolving}
                >
                  No, I still need help
                </button>
              </div>
            </section>
          )}

          {showComment && (
            <form
              className="not-resolved-form"
              onSubmit={handleNotResolved}
            >
              <div className="section-heading">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 5h16v11H8l-4 4z" />
                </svg>

                <h2>Describe the problem</h2>
              </div>

              <label htmlFor="comment">
                Explain what is still not working:
              </label>

              <textarea id="comment"
                value={comment}
                placeholder="Tell the technician what still needs to be fixed"
                onChange={(event) =>
                  setComment(event.target.value)
                }
                required
                rows="5"
              />

              <div className="comment-form-actions">
                <button
                  className="send-comment-button"
                  type="submit"
                  disabled={
                    sendingComment || !comment.trim()
                  }
                >
                  {sendingComment? "Sending..."
                    : "Send to Technician"}
                </button>

                <button
                  className="cancel-comment-button"
                  type="button"
                  onClick={() => {
                    setShowComment(false);
                    setComment("");
                  }}
                  disabled={sendingComment}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="emergency-support-card">
          <div className="emergency-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4h3l2 5-2 2a16 16 0 0 0 4 4l2-2 5 2v3c0 1-1 2-2 2A17 17 0 0 1 4 5c0-1 1-2 3-1Z" />
            </svg>
          </div>

          <h2>Emergency Support</h2>

          <p>
            For urgent issues that stop critical work,
            contact IT Support directly.
          </p>

          <a href="tel:+97312345678">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4h3l2 5-2 2a16 16 0 0 0 4 4l2-2 5 2v3c0 1-1 2-2 2A17 17 0 0 1 4 5c0-1 1-2 3-1Z" />
            </svg>

            +973 1234 5678
          </a>
        </aside>
      </div>
    </main>
  );
}

export default OneRequest;