import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOneSubcategory } from "../services/category";
import { createRequest } from "../services/requests";
import toast from "react-hot-toast";

function RequestSupport() {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const [subcategory, setSubcategory] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    priority: "Medium",
    requestDetails: {}
  });

async function loadSubcategory() {
      try {
        const response = await getOneSubcategory(subcategoryId);

        setSubcategory(response.scategory);
        setCategoryId(response.categoryId);
      } catch (err) {
        toast.error("Failed to load the subcategory");
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    loadSubcategory();
  }, [subcategoryId]);

  function handlePriorityChange(event) {
    setFormData({
      ...formData,
      priority: event.target.value
    });
  }

  function handleFieldChange(event, fieldLabel) {
  const { value, type, files } = event.target;

  setFormData({
    ...formData,
    requestDetails: {
      ...formData.requestDetails,
      [fieldLabel]: type === "file" ? files[0] : value
    }
  });
}

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const requestBody = {
        categoryId,
        subcategoryId,
        priority: formData.priority,
        requestDetails: formData.requestDetails
      };

      await createRequest(requestBody);

      toast.success("Request created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create the request"
      );
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!subcategory) {
    return <p>Subcategory not found.</p>;
  }

  return (
    <div>
      <h1>Request Support</h1>

      <h2>{subcategory.name}</h2>
      <p>{subcategory.about}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="priority">Priority</label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handlePriorityChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {subcategory.formFields.map((field) => (
          <div key={field._id}>
            <label htmlFor={field.label}>
              {field.label}
              {field.required && " *"}
            </label>

            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData.requestDetails[field.label] || ""}
                onChange={handleFieldChange}
                required={field.required}
              >
                <option value="">Select {field.label}</option>

                {field.options.map((option) => (
                  <option key={option} value={option} onChange={(event) => handleFieldChange(event, field.label)}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData.requestDetails[field.label] || ""}
                onChange={(event) => handleFieldChange(event, field.label)}
                required={field.required}
              />
            ) : field.type === "file" ? (
              <input
                id={field.name}
                name={field.name}
                type="file"
                onChange={(event) => handleFieldChange(event, field.label)}
                required={field.required}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData.requestDetails[field.label] || ""}
                onChange={(event) =>handleFieldChange(event, field.label)}
                required={field.required}
              />
            )}
          </div>
        ))}

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default RequestSupport;