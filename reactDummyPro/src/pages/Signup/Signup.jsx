import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
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
import usersSeed from "../../data/users.json";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getUsers = () => {
    const stored = localStorage.getItem("users");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore parse errors
      }
    }
    localStorage.setItem("users", JSON.stringify(usersSeed));
    return usersSeed;
  };

  const validate = () => {
    const nextErrors = {};
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();

    if (!nameTrimmed) {
      nextErrors.name = "Full name is required.";
    } else if (nameTrimmed.length < 2) {
      nextErrors.name = "Full name must be at least 2 characters.";
    }

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

  const handleSignup = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const emailNormalized = email.trim().toLowerCase();
      const exists = users.some((user) => user.email?.toLowerCase() === emailNormalized);

      if (exists) {
        setIsLoading(false);
        toast.error("Email already registered. Please sign in.");
        return;
      }

      const nextUsers = [
        ...users,
        {
          id: Date.now(),
          name: name.trim(),
          email: emailNormalized,
          password
        }
      ];
      localStorage.setItem("users", JSON.stringify(nextUsers));
      toast.success("Account created successfully.");
      setTimeout(() => navigate("/login"), 900);
    }, 900);
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
                      aria-invalid={Boolean(errors.name)}
                      className={errors.name ? styles.inputError : undefined}
                      required
                    />
                  </div>
                  {errors.name && <p className={styles.errorText}>{errors.name}</p>}
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
                      placeholder="Create a strong password"
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
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
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
