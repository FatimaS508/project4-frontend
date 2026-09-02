import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOneSubcategory } from "../services/category";
import { createRequest } from "../services/requests";
import toast from "react-hot-toast";

function RequestSupport() {
  const { subcategoryId } = useParams()
  const navigate = useNavigate()

  const [subcategory, setSubcategory] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  //const [selectedFileName, setSelectedFileName] = useState("");

  const [formData, setFormData] = useState({
    priority: "Medium",
    requestDetails: {},
    attachments: {}
  });

  async function loadSubcategory() {
    try {
      const response = await getOneSubcategory(subcategoryId)

      setSubcategory(response.scategory)
      setCategoryId(response.categoryId)
    } catch (err) {
      console.log(err);
      toast.error("Failed to load the subcategory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubcategory()
  }, [subcategoryId])

  function handlePriorityChange(event) {
    setFormData((currentData) => ({
      ...currentData,
      priority: event.target.value,
    }));
  }

  function handleFieldChange(event, fieldLabel) {
  const { value, type, files } = event.target;

  if (type === "file") { const selectedFile = files[0];

    if (!selectedFile) {return}

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB")
      event.target.value = ""
      return}

    const reader = new FileReader()

    reader.onloadend = () => {
      setFormData((currentData) => ({
        ...currentData, attachments: {
          ...currentData.attachments,

          [fieldLabel]: {fileName: selectedFile.name, image: reader.result,
          },
        },
      }))}

    reader.readAsDataURL(selectedFile)
    return}

  setFormData((currentData) => ({
    ...currentData,

    requestDetails: {...currentData.requestDetails, [fieldLabel]: value,}
  }))
}

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSubmitting(true)

      const requestBody = { categoryId, subcategoryId, priority: formData.priority, requestDetails: formData.requestDetails,
         attachments: Object.values(formData.attachments).map((attachment) => attachment.image
  )}

      await createRequest(requestBody)

      toast.success("Request created successfully!")
      navigate("/dashboard")
    } catch (err) {
      console.log(err)

      toast.error(err.response?.data?.message || "Failed to create the request")
      setSubmitting(false)
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

  if (!subcategory) {
    return (
      <main className="request-support-page">
        <p className="request-page-error">
          Subcategory not found.
        </p>

        <button className="request-back-button" type="button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    )
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
          <p>New Support Request</p>
          <h1>{subcategory.name}</h1>

          {subcategory.about && (
            <span>{subcategory.about}</span>
          )}
        </header>

        <form
          className="request-support-form"
          onSubmit={handleSubmit}
        >
          <div className="request-field">
            <label htmlFor="priority">
              Priority <span className="required-mark">*</span>
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
            <div className="request-field" key={field._id}>
              <label htmlFor={field.name}>
                {field.label}

                {field.required && (
                  <span className="required-mark"> *</span>
                )}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={
                    formData.requestDetails[field.label] || ""
                  }
                  onChange={(event) =>
                    handleFieldChange(event, field.label)
                  }
                  required={field.required}
                >
                  <option value="">
                    Select {field.label}
                  </option>

                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={
                    formData.requestDetails[field.label] || ""
                  }
                    placeholder={field.label === "Request Justification" ? "Explain why you need this access or service"
                      : field.label === "Required Permissions" ? "Example: Admin access to Microsoft Teams"
                        : `Enter ${field.label.toLowerCase()}`
                    }
                  onChange={(event) =>
                    handleFieldChange(event, field.label)
                  }
                  required={field.required}
                  rows="5"
                />
                ) : field.type === "file" ? (
                  <label
                    className="file-upload-box"
                    htmlFor={field.name}
                  >
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
                      Upload an image
                    </span>

                    <span className="upload-description">
                      Click here to select an image
                    </span>

                      <span className="selected-file-name">
                        {formData.attachments[field.label]?.fileName || "No image selected"}
                      </span>

                      {formData.attachments[field.label]?.image && (
                        <img className="attachment-preview" src={formData.attachments[field.label].image} alt={`${field.label} preview`}/>
                      )} 

                      <input
                        className="file-upload-input"
                        id={field.name}
                        name={field.name}
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleFieldChange(event, field.label)
                        }
                        required={field.required && !formData.attachments[field.label]}
                      />
                  </label>
                ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={
                    formData.requestDetails[field.label] || ""
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  onChange={(event) =>
                    handleFieldChange(event, field.label)
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
                ? "Submitting..."
                : "Submit Request"}
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

export default RequestSupport;