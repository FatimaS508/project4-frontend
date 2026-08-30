import { useEffect, useState } from "react";
import { getOneCategory } from "../services/category";
import { useParams, useNavigate } from "react-router";

function OneCategory() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadCategory() {
    try {
      setLoading(true)
      setError("")
      const response = await getOneCategory(categoryId)
      setCategory(response)
    } catch (err) {
      console.log(err)
      setError("Could not load this category.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategory()
  }, [categoryId])

  if (loading) {
    return (
      <main className="one-category-page">
        <p className="category-page-message">
          Loading services...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="one-category-page">
        <p className="category-page-error">{error}</p>
        <button className="category-back-button" type="button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    )
  }

  return (
    <main className="one-category-page">
      <button className="category-back-button" type="button" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      <header className="one-category-heading">
        <p>Support Services</p>
        <h1>{category?.name}</h1>

        {category?.about && <span>{category.about}</span>}
      </header>

      {category?.subcategories?.length > 0 ? (
        <section className="subcategory-grid">
          {category.subcategories.map((subcategory, index) => (
            <article
              className="subcategory-card"
              key={subcategory._id}
            >
              <span className="subcategory-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="subcategory-content">
                <h2>{subcategory.name}</h2>

                {subcategory.about && (
                  <p>{subcategory.about}</p>
                )}
              </div>

              <button className="request-support-button" type="button"
                onClick={() =>
                  navigate(`/request/${subcategory._id}`)}
              >
                Request Support
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m14 7 5 5-5 5" />
                </svg>
              </button>
            </article>
          ))}
        </section>
      ) : (
        <p className="category-page-message">
          No services are currently available in this category.
        </p>
      )}
    </main>
  )
}

export default OneCategory;

