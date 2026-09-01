import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOneSubcategory } from "../services/category";
import {
  getOneRequest,
  updateRequest
} from "../services/requests";
import toast from "react-hot-toast";

function EditRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("")

  const [formData, setFormData] = useState({
    priority: "Medium",
    requestDetails: {},
    attachments: []
  });

  async function loadRequest() {
    try {
      const requestResponse = await getOneRequest(requestId);
      const currentRequest =
        requestResponse.request ?? requestResponse;

      setRequest(currentRequest);

      if (currentRequest.status !== "New") {
        toast.error(
          "You can only edit requests with New status."
        );

        navigate(`/requests/${requestId}`);
        return;
      }

      const currentSubcategoryId =
        currentRequest.subcategoryId?._id ||
        currentRequest.subcategoryId;

      const subcategoryResponse =
        await getOneSubcategory(currentSubcategoryId);

      setSubcategory(subcategoryResponse.scategory);

      setFormData({
        priority: currentRequest.priority || "Medium",
        requestDetails: currentRequest.requestDetails || {},
         attachments: currentRequest.attachments || []
      });
    } catch (err) {
      console.log(err);

      toast.error("Failed to load the request");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  function handlePriorityChange(event) {
    setFormData((currentData) => ({
      ...currentData,
      priority: event.target.value
    }));
  }

 function handleFieldChange(event, fieldLabel) {
  const { value, type, files } = event.target

  if (type === "file") {const selectedFile = files[0];

    if (!selectedFile) {return;}

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB")
      event.target.value = ""
      return;}

    const reader = new FileReader()

    reader.onloadend = () => {setFormData((currentData) => ({...currentData,
        attachments: [reader.result]
      }))

      setSelectedFileName(selectedFile.name)}

    reader.readAsDataURL(selectedFile)
    return;
  }

  setFormData((currentData) => ({...currentData,requestDetails: {
      ...currentData.requestDetails,
      [fieldLabel]: value
    }}))
}

  function getFieldValue(fieldLabel) {const detail = formData.requestDetails[fieldLabel];

    if (
      typeof detail === "object" &&
      detail !== null &&
      !(detail instanceof File)
    ) {
      return detail.value || ""
    }
    return detail || ""
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);

      const requestBody = {
        priority: formData.priority,
        requestDetails: formData.requestDetails,
        attachments: formData.attachments
      };

      await updateRequest(requestId, requestBody);

      toast.success("Request updated successfully!", {
        duration: 4000
      });

      navigate(`/requests/${requestId}`);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update the request"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="request-support-page">
        <p className="request-page-message">
          Loading request form...
        </p>
      </main>
    );
  }

  if (!request || !subcategory) {
    return (
      <main className="request-support-page">
        <p className="request-page-error">
          Request not found.
        </p>

        <button
          className="request-back-button"
          type="button"
          onClick={() => navigate("/requests")}
        >
          Back to My Requests
        </button>
      </main>
    );
  }

  return (
    <main className="request-support-page">
      <button
        className="request-back-button"
        type="button"
        onClick={() => navigate(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>

        Back
      </button>

      <section className="request-form-container">
        <span className="request-form-decoration"></span>

        <header className="request-form-heading">
          <p>Edit Support Request</p>

          <h1>{subcategory.name}</h1>

          <span>
            Request no. #{request.requestNumber}
          </span>
        </header>

        <form
          className="request-support-form"
          onSubmit={handleSubmit}
        >
          <div className="request-field">
            <label htmlFor="priority">
              Priority
              <span className="required-mark"> *</span>
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handlePriorityChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {subcategory.formFields?.map((field) => (
            <div
              className="request-field"
              key={field._id}
            >
              <label htmlFor={field.name}>
                {field.label}

                {field.required && (
                  <span className="required-mark">
                    {" "}*
                  </span>
                )}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={getFieldValue(field.label)}
                  onChange={(event) =>
                    handleFieldChange(
                      event,
                      field.label
                    )
                  }
                  required={field.required}
                >
                  <option value="">
                    Select {field.label}
                  </option>

                  {field.options?.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={getFieldValue(field.label)}
                  placeholder={
                    field.label ===
                    "Request Justification"
                      ? "Explain why you need this access or service"
                      : field.label ===
                          "Required Permissions"
                        ? "Example: Admin access to Microsoft Teams"
                        : `Enter ${field.label.toLowerCase()}`
                  }
                  onChange={(event) =>
                    handleFieldChange(
                      event,
                      field.label
                    )
                  }
                  required={field.required}
                  rows="5"
                />
              ) : field.type === "file" ? (
                <label
                  className="file-upload-box"
                  htmlFor={field.name}
                >
                                  <span className="selected-file-name">
                                      {selectedFileName ||
                                          (formData.attachments.length > 0
                                              ? "Current image attached"
                                              : "No image selected")}
                                  </span>
                  <svg
                    className="upload-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M7 18a5 5 0 0 1-.6-9.97A7 7 0 0 1 20 10a4 4 0 0 1 0 8H7Z" />
                    <path d="m9 12 3-3 3 3" />
                    <path d="M12 9v7" />
                  </svg>

                  <span className="upload-title">
                    Replace the image
                  </span>

                  <span className="upload-description">
                    Click here to select a new image
                  </span>

                  <span className="selected-file-name">
                    {formData.requestDetails[field.label]
                      ?.name ||
                      (formData.requestDetails[field.label]
                        ? "Current image attached"
                        : "No image selected")}
                  </span>

                  <input
                    className="file-upload-input"
                    id={field.name}
                    name={field.name}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleFieldChange(
                        event,
                        field.label
                      )
                    }
                    required={
                      field.required &&
                      !formData.requestDetails[field.label]
                    }
                  />
                </label>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={getFieldValue(field.label)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  onChange={(event) =>
                    handleFieldChange(
                      event,
                      field.label
                    )
                  }
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="request-form-actions">
            <button
              className="submit-request-button"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              className="request-cancel-button"
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditRequest;