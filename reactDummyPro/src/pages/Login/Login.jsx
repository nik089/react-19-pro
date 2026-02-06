import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/layout/Header";
import styles from "../Login/Landing.module.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header showLogin={false} />

      <div className={styles.loginContainer}>
        {/* Left Side - Illustration */}
        <div className={styles.leftSide}>
          <div className={styles.illustration}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
            <div className={styles.illustrationContent}>
              <h1>Welcome Back!</h1>
              <p>Sign in to continue managing your team efficiently and securely.</p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Secure Authentication</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Real-time Updates</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.rightSide}>
          <div className={styles.loginBox}>
            <div className={styles.loginHeader}>
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🔒</span>
                  <input
                    id="password"
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
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className={styles.forgotPassword}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <div className={styles.socialLogin}>
              <button className={styles.socialButton}>
                <span className={styles.socialIcon}>🔵</span>
                Google
              </button>
              <button className={styles.socialButton}>
                <span className={styles.socialIcon}>⚫</span>
                GitHub
              </button>
            </div>

            <div className={styles.signupLink}>
              Don't have an account?{" "}
              <a href="#" onClick={() => navigate("/")}>
                Sign up for free
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;