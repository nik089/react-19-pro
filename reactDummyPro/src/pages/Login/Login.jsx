import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import styles from "../Login/Login.module.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../services/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsLoading(true);

    try {
      const user = await login(email.trim(), password);
      if (user) {
        toast.success("Login successful.");
        setTimeout(() => navigate("/dashboard"), 600);
      } else {
        toast.error("Email or password does not match.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header showLogin={false} hideProfile={true} />

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
                      aria-invalid={Boolean(errors.email)}
                      className={errors.email ? styles.inputError : undefined}
                      required
                    />
                  </div>
                  {errors.email && <p className={styles.errorText}>{errors.email}</p>}
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
                      aria-invalid={Boolean(errors.password)}
                      className={errors.password ? styles.inputError : undefined}
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
                  {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </div>

                <button type="submit" className={styles.loginButton} disabled={isLoading}>
                  {isLoading ? (
                    <span className={styles.buttonLoader}>
                      <span className={styles.spinner}></span>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className={styles.signupRow}>
                <span>New here?</span>
                <button
                  type="button"
                  className={styles.signupLink}
                  onClick={() => navigate("/signup")}
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;
