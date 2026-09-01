import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import toast from "react-hot-toast"

import { useAuth } from "../context/AuthContext"
import {getOneRequest,addReply,deleteReply} from "../services/requests"


function ReplyTechnician() {
  const { requestId } = useParams()
  const { user } = useAuth()

  const [request, setRequest] = useState(null)

  const [formData, setFormData] = useState({
    message: ""
  })

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [deletingReplyId, setDeletingReplyId] = useState(null)
  const [error, setError] = useState("")

  async function loadRequest() {
    try {
      setError("")

      const response = await getOneRequest(requestId)

      setRequest(response.request ?? response)
    } catch (err) {
      console.log(err)
      setError("Failed to load request")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequest()
  }, [requestId])

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

async function handleSubmit(event) {
  event.preventDefault()

  if (!formData.message.trim()) {
    toast.error("Please enter a message")
    return
  }

  try {
    setSending(true)

    const response = await addReply(requestId, {
      message: formData.message.trim()
    })

    setRequest(response.request)

    setFormData({message: ""
    })

    toast.success("Reply added successfully",{duration: 4000})
  } catch (err) {
    console.log(err)

    toast.error(
      err.response?.data?.message || "Failed to add reply"
    )
  } finally {
    setSending(false)
  }
}

  async function handleDeleteReply(replyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reply?"
    )

    if (!confirmed) return

    try {
      setDeletingReplyId(replyId)

      await deleteReply(requestId, replyId)
      await loadRequest()

      toast.success("Reply deleted successfully",{duration: 4000})
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete reply")
    } finally {
      setDeletingReplyId(null)
    }
  }

  function displayValue(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided"
    }

    if (typeof value === "object") {
      return (
        value.value ||
        value.name ||
        "Not provided"
      )
    }

    return value
  }

  if (loading) {
    return (
      <main className="reply-technician-page">
        <p className="reply-page-message">
          Loading request...
        </p>
      </main>
    )
  }

  if (error || !request) {
    return (
      <main className="reply-technician-page">
        <p className="reply-page-error">
          {error || "Request not found"}
        </p>
      </main>
    )
  }

  const subcategory =
    request.category?.subcategories?.find(
      (item) =>
        item._id?.toString() ===
        request.subcategoryId?.toString()
    )

  return (
    <main className="reply-technician-page">
      <a
        href="#"
        className="reply-back-link"
        onClick={(event) => {
          event.preventDefault()
          window.history.back()
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>

        Back to Requests
      </a>

      <header className="reply-page-heading">
        <p>Technician Workspace</p>

        <h1>{request.title}</h1>

        <div className="reply-heading-badges">
          <span>{request.priority} Priority</span>
          <strong>{request.status}</strong>
        </div>
      </header>

      <div className="reply-page-content">
        <section className="technician-request-details">
          <div className="reply-section-heading">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18H6z" />
              <path d="M9 8h6" />
              <path d="M9 12h6" />
              <path d="M9 16h4" />
            </svg>

            <h2>Request Details</h2>
          </div>

          <div className="technician-details-grid">
            <div className="technician-detail">
              <span>Employee</span>

              <strong>
                {request.createdBy?.username || "Unknown"}
              </strong>
            </div>

            <div className="technician-detail">
              <span>Category</span>

              <strong>
                {request.category?.name || "Unknown"}
              </strong>
            </div>

            <div className="technician-detail">
              <span>Priority</span>
              <strong>{request.priority}</strong>
            </div>

            <div className="technician-detail">
              <span>Status</span>
              <strong>{request.status}</strong>
            </div>

            {Object.entries( request.requestDetails || {}).map(([name, value]) => {
              const field = subcategory?.formFields?.find((item) =>
                    item.name === name || item.label === name
                )

              return (
                <div
                  className="technician-detail"
                  key={name}
                >
                  <span>
                    {value?.label ||
                      field?.label ||
                      name}
                  </span>

                  <strong>
                    {displayValue(value)}
                  </strong>
                </div>
              )
            })}
          </div>

        </section>

        <section className="technician-reply-form-section">
          <div className="reply-section-heading">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>

            <h2>Technician Reply</h2>
          </div>

          <form
            className="technician-reply-form"
            onSubmit={handleSubmit}
          >
            <div className="technician-reply-field">
              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="7"
                value={formData.message}
                placeholder="Write your response or solution"
                onChange={handleChange}
                required
              />
            </div>

            <div className="technician-reply-field">
              <label htmlFor="issuedBy">
                Issued By
              </label>

              <input
                id="issuedBy"
                type="text"
                value={user?.username || ""}
                readOnly
              />
            </div>

            <button
              className="send-technician-reply"
              type="submit"
              disabled={sending}
            >
              {sending? "Sending..."
                : "Send Reply"}

              {!sending && (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m3 11 18-8-8 18-2-8z" />
                  <path d="m11 13 10-10" />
                </svg>
              )}
            </button>
          </form>
        </section>
      </div>

      <section className="technician-replies-section">
        <div className="replies-title-row">
          <div className="reply-section-heading">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>

            <h2>Reply History</h2>
          </div>

          <span>{request.replies?.length || 0}</span>
        </div>

        {!request.replies?.length ? (
          <div className="technician-no-replies">
            <p>No replies have been added yet.</p>
          </div>
        ) : (
          <div className="technician-replies-list">
            {request.replies.map((reply) => (
              <article
                className="technician-reply-card"
                key={reply._id}
              >
                <div className="reply-card-header">
                  <div className="reply-author">
                    <span>
                      {reply.sender?.username?.charAt(0)
                        .toUpperCase() || "T"}
                    </span>

                    <div>
                      <h3>
                        {reply.sender?.username || "Unknown technician"} -{" "} {reply.sender?.role === "technician" ? "You" : "Employee"}
                      </h3>

                      <p>
                        {reply.createdAt? new Date(reply.createdAt).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>
                  </div>

                  <button
                    className="delete-reply-button"
                    type="button"
                    onClick={() =>
                      handleDeleteReply(reply._id)
                    }
                    disabled={
                      deletingReplyId === reply._id
                    }
                  >
                    {deletingReplyId === reply._id? "Deleting..."
                      : "Delete"}
                  </button>
                </div>

                <p className="reply-card-message">
                  {reply.message}
                </p>


                      
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ReplyTechnician