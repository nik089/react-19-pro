import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/layout/Header";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Header showLogin={false} />
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <br /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <br /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}

export default Login;
