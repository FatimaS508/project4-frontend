import React from 'react'
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {getOneRequest,addReply} from "../services/requests";

function ReplyTechnician() {
  const { requestId } = useParams();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);

  const [formData, setFormData] = useState({
    message: "",
    attachmentUrl: "",
    fileType: "image"
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequest() {
      try {
        const response = await getOneRequest(requestId);

        setRequest(response.request ?? response);
      } catch (err) {
        console.log(err);
        setError("Failed to load request");
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [requestId]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const attachments = [];

    if (formData.attachmentUrl.trim()) {
      attachments.push({
        url: formData.attachmentUrl.trim(),
        fileType: formData.fileType,
        fileName:
          formData.attachmentUrl.split("/").pop() ||
          "Attachment"
      });
    }

    const replyData = {
      message: formData.message.trim(),
      attachments
    };

    try {
      setSending(true);

      const response = await addReply(
        requestId,
        replyData
      );

      
      setRequest(response.request);

      setFormData({
        message: "",
        attachmentUrl: "",
        fileType: "image"
      });

      toast.success("Reply added successfully");
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to add reply"
      );
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <p>Loading request...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const subcategory = request.category.subcategories.find(
    (subcategory) =>
      subcategory._id.toString() ===
      request.subcategoryId.toString())

  return (
    <div>
      <main className="reply-page">
      <Link
        to={`/requests2/subcategory/${request.subcategoryId}`}
        className="back-link"
      >
        Back to requests
      </Link>

      <h1>{request.title}</h1>

      <div className="reply-page-content">
        
        <section className="request-details">
          <h2>Request Details</h2>

          <p>
            <strong>Employee:</strong>{" "}
            {request.createdBy?.username || "Unknown"}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {request.category?.name || "Unknown"}
          </p>

          <p>
            <strong>Priority:</strong>{" "}
            {request.priority}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {request.status}
          </p>

            {Object.entries(request.requestDetails).map(([name, value]) => {
              const field = subcategory.formFields.find(
                (field) => field.name === name
              );

              return (
                <p key={name}>
                  <strong>{field.label}:</strong> {value}
                </p>)})}

          {request.attachments?.length > 0 && (
            <div>
              <h3>Request Attachments</h3>

              {request.attachments.map(
                (attachment, index) => (
                  <a
                    key={index}
                    href={attachment}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View attachment {index + 1}
                  </a>
                )
              )}
            </div>
          )}
        </section>

        
        <section className="reply-form-section">
          <h2>Technician Reply</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="message">Message:</label>

              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="attachmentUrl">
                Attachment URL (optional):
              </label>

              <input
                id="attachmentUrl"
                name="attachmentUrl"
                type="url"
                value={formData.attachmentUrl}
                onChange={handleChange}
              />
            </div>

            {formData.attachmentUrl && (
              <div>
                <label htmlFor="fileType">
                  File type:
                </label>

                <select
                  id="fileType"
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleChange}
                >
                  <option value="image">Image</option>
                  <option value="document">
                    Document
                  </option>
                  <option value="audio">Audio</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="issuedBy">
                Issued by:
              </label>

              <input
                id="issuedBy"
                type="text"
                value={user?.username || ""}
                readOnly
              />
            </div>

            <button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </form>
        </section>
      </div>

      
      <section className="replies-section">
        <h2>Replies</h2>

        {!request.replies?.length ? (
          <p>No replies yet.</p>
        ) : (
          request.replies.map((reply) => (
            <article
              className="reply-card"
              key={reply._id}
            >
              <p>{reply.message}</p>

              <p>
                <strong>Issued by:</strong>{" "}
                {reply.sender?.username ||
                  "Unknown technician"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  reply.createdAt
                ).toLocaleString()}
              </p>

              {reply.attachments?.map((attachment) => (
                <div
                  key={attachment._id || attachment.url}
                >
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {attachment.fileName ||
                      "View attachment"}
                  </a>
                </div>
              ))}
            </article>
          ))
        )}
      </section>
    </main>
    </div>
  )
}

export default ReplyTechnician