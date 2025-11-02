import { useState } from "react";
import * as usersAPI from "../../utilities/users-api";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit}>
      <input name="username" value={formData.username} onChange={handleChange} required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      <input name="password" type="password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
}
