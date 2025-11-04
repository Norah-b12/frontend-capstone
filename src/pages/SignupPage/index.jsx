import { useState } from "react";
import * as usersAPI from "../../utilities/users-api";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function SignupPage({ setUser }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await usersAPI.signup(formData);
      if (!user) throw new Error("Signup failed");
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Try again.");
    }
  }

  return (
    <div className="signup-page">
    <div className="signup-card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
   <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
          {error && <p>{error}</p>}
      </form>
    </div>
  </div>
  );
}
