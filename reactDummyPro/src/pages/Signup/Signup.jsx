import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/layout/Header";
import styles from "./Signup.module.css";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaUser
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      navigate("/login");
    }, 1200);
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
              <h1>Create Your Workspace</h1>
              <p>Get started with smarter user management in just a few steps.</p>

              <div className={styles.features}>
                <div className={styles.feature}>
                  <FaCheckCircle className={styles.checkIcon} />
                  Guided onboarding
                </div>
                <div className={styles.feature}>
                  <FaCheckCircle className={styles.checkIcon} />
                  Secure access controls
                </div>
                <div className={styles.feature}>
                  <FaCheckCircle className={styles.checkIcon} />
                  Fast team setup
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.loginBox}>
              <div className={styles.loginHeader}>
                <h2>Sign Up</h2>
                <p>Create your account to start managing users</p>
              </div>

              <form onSubmit={handleSignup} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
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
                  {isLoading ? <span className={styles.spinner}></span> : "Create Account"}
                </button>
              </form>

              <div className={styles.signupRow}>
                <span>Already have an account?</span>
                <button
                  type="button"
                  className={styles.signupLink}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
