import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/layout/Header";
import styles from "../Login/Login.module.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuth", "true");
      navigate("/dashboard");
    }, 1500);

  };

  return (
    <div className={styles.page}>
      <Header showLogin={false} />

      <main className={styles.main}>
        <div className={styles.loginContainer}>
          <div className={styles.leftSide}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>

            <div className={styles.illustrationContent}>
              <h1>Welcome Back!</h1>
              <p>Sign in to continue managing your team efficiently and securely.</p>

              <div className={styles.features}>
                <div className={styles.feature}>
                  <FaCheckCircle className={styles.checkIcon} />
                  Secure Authentication
                </div>
                <div className={styles.feature}>
                  <FaCheckCircle className={styles.checkIcon} />
                  Real-time Updates
                </div>
                <div className={styles.feature}>
                  <FaCheckCircle className={styles.checkIcon} />
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.loginBox}>
              <div className={styles.loginHeader}>
                <h2>Sign In</h2>
                <p>Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <div className={styles.inputWrapper}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Password</label>
                  <div className={styles.inputWrapper}>
                    <FaLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button type="submit" className={styles.loginButton} disabled={isLoading}>
                  {isLoading ? <span className={styles.spinner}></span> : "Sign In"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;
