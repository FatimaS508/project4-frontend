import { useState } from "react";
import { useNavigate } from "react-router";

import { signIn } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function SignInForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({username: "", password: "",});

  function handleChange(event) {
    setError("");

    setFormData({
      ...formData, [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);

      const signedInUser = await signIn(formData);

      setUser(signedInUser);

      if (signedInUser.role === "technician") {
        navigate("/dashboard2");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(`Error: ${err}`);

      setError(
        err?.response?.data?.message || "Could not sign in"
      );

      setSubmitting(false);
    }
  }

  const isFormInvalid = !formData.username || !formData.password;

  return (
    <main className="signup-page">
      <section className="signup-container">
        <div className="signup-heading">
          <h1>Sign In</h1>
        </div>

        <form
          className="signup-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {error && <p className="signup-error">{error}</p>}

          <div className="signup-field">
            <label htmlFor="username">Username:</label>

            <input
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password:</label>

            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-actions">
            <button
              className="signup-button"
              type="submit"
              disabled={isFormInvalid || submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            <button
              className="cancel-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>

          <p className="signin-link">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignInForm;

