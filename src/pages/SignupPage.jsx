import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    role: "employee",
    employeeId: "",
    department: ""
  });
  const [ submitting, setSubmitting ] = useState(false)

  const { username, password, passwordConf } = formData;

  function handleChange(event){
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });

  }


  async function handleSubmit(event){
    event.preventDefault();
    try {
      setSubmitting(true)
      await signUp(formData);
      navigate('/sign-in')
    } catch (err) {
      setError(err.response.data.message);
      setSubmitting(false)
    }
  }

  function isFormInvalid(){
    return !(username && password && password === passwordConf);
  };

  return (
    <main className="signup-page">
      <section className="signup-container">
      <div className="signup-heading">
      <h1>Sign Up</h1>
      </div>
      <p className="error">{error}</p>
      <form onSubmit={handleSubmit}>
        <div className="signup-field">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>
         <fieldset className="role-section">
          <legend>Select your role</legend>

          <div className="role-options">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="employee"
                checked={formData.role === "employee"}
                onChange={handleChange}
              />

              <span>Employee</span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="technician"
                checked={formData.role === "technician"}
                  onChange={(event) => {
                    setFormData({...formData,
                      role: event.target.value,
                      employeeId: "",
                      department: "",
                    })}}
              />

              <span>Technician</span>
            </label>
          </div>
        </fieldset>
          <div className="signup-field">
            <label htmlFor="employeeId">Employee ID</label>

            <input
              id="employeeId"
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              readOnly={formData.role === "technician"}
              required={formData.role === "employee"}
              placeholder="Enter your employee ID"
              className={formData.role === "technician" ? "readonly-field" : ""}
            />
          </div>

          <div className="signup-field">
            <label htmlFor="department">Department</label>

            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={formData.role === "technician"}
              required={formData.role === "employee"}
              className={formData.role === "technician" ? "readonly-field" : ""}
            >
              <option value="">Select Department</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Information Technology">
                Information Technology
              </option>
            </select>
          </div>
        
        <div className="signup-field">
          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="signup-field">
          <label htmlFor="confirm">Confirm Password</label>

          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            placeholder="Enter your password again"
            autoComplete="new-password"
            required
          />
          {passwordConf && password !== passwordConf && (
            <p className="password-error">Passwords do not match.</p>
          )}
        </div>
        <div className="signup-actions">
          <button
            className="signup-button"
            type="submit"
            disabled={isFormInvalid() || submitting}
          >
            {submitting ? "Signing up..." : "Sign Up"}
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
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/sign-in")}>
            Sign in
          </button>
        </p>
      </form>
      </section>
    </main>
  );
}
export default Signup;
