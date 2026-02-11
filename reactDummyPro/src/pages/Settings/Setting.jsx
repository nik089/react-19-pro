import { useState } from "react";
import styles from "./Setting.module.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../services/AuthContext";

function Setting() {
  const { currentUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!oldPassword) {
      nextErrors.oldPassword = "Old password is required.";
    }

    if (!newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = "New password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (oldPassword === newPassword) {
      nextErrors.newPassword = "New password must be different from old password.";
    }

    return nextErrors;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        // Get users from localStorage
        const stored = localStorage.getItem("users");
        if (!stored) {
          toast.error("No users found");
          setIsLoading(false);
          return;
        }

        const users = JSON.parse(stored);
        
        // Find current user
        const userIndex = users.findIndex(
          (u) => u.email?.toLowerCase() === currentUser?.email?.toLowerCase()
        );

        if (userIndex === -1) {
          toast.error("User not found");
          setIsLoading(false);
          return;
        }

        // Verify old password
        if (users[userIndex].password !== oldPassword) {
          toast.error("Old password is incorrect");
          setIsLoading(false);
          return;
        }

        // Update password
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        // Reset form
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});

        toast.success("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 900);
  };

  return (
    <div className={styles.setting}>
      <h1>System Settings</h1>

      <div className={styles.card}>
        <h3>Security - Change Password</h3>
        <form onSubmit={handleUpdatePassword} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Old Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={errors.oldPassword ? styles.inputError : ""}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className={styles.errorText}>{errors.oldPassword}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>New Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={errors.newPassword ? styles.inputError : ""}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className={styles.errorText}>{errors.newPassword}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? styles.inputError : ""}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword}</p>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
