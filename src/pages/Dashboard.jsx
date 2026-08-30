import { useAuth } from "../context/AuthContext";
import { getAllCategories } from "../services/category";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function Dashboard() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadAllCategories() {
    try {
      const response = await getAllCategories()
      setCategories(response);
    } catch (err) {
      console.log(err)
      setError("Could not load support categories.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllCategories()
  }, [])

  return (
    <main className="dashboard-page">
      <header className="dashboard-heading">
        <p>Support Center</p>
        <h1>Welcome, {user?.username}</h1>
        <span>Select a category to find the support you need.</span>
      </header>

      {loading && (
        <p className="dashboard-message">Loading categories...</p>
      )}

      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <section className="category-grid">
          {categories.map((category, index) => (
            <Link className="category-card" to={`/category/${category._id}`} key={category._id}>
              <span className="card-decoration"></span>

              <div className="category-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="category-content">
                <h2>{category.name}</h2>

                {category.about && <p>{category.about}</p>}

                <span className="category-action">
                  View services
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m14 7 5 5-5 5" />
                  </svg>
                </span>
              </div>
            </Link>))}
        </section>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="dashboard-message">
          No support categories are currently available.
        </p>
      )}
    </main>
  );
}

export default Dashboard;