import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as usersAPI from "../../utilities/users-api";
import "./styles.css";

export default function LoginPage({ setUser }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const me = await usersAPI.login(formData);
            setUser(me);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Login failed. Check credentials.");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <button type="submit">Log In</button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

