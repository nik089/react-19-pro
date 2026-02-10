import { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaUserShield, FaBriefcase } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { addNewUser, displayAllUsers, initializeUsersFromJSON } from "../../../services/userService";
import styles from "./addUser.module.css";

function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize from userList.json on component mount
  useEffect(() => {
    initializeUsersFromJSON();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(form.mobile.replace(/[\s-]/g, ""))) newErrors.mobile = "Invalid mobile (10 digits)";
    if (!form.role) newErrors.role = "Role is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field after user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", mobile: "", role: "" });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }
    
    setLoading(true);
    try {
      const newUser = await addNewUser(form);
      
      toast.success("✅ User created successfully!", {
        duration: 4000,
        icon: "✨"
      });
      
      // Show user details in toast
      toast((t) => (
        <div>
          <p><strong>{newUser.name}</strong> ({newUser.role})</p>
          <p style={{fontSize: "12px", color: "#64748b"}}>{newUser.email}</p>
        </div>
      ), { duration: 5000 });
      
      // Display all users in console
      setTimeout(() => {
        console.log("✅ USER CREATION SUCCESSFUL");
        displayAllUsers();
        console.log("💾 Data saved to browser localStorage");
        console.log("📥 To download: exportUsersAsJSON()");
      }, 500);
      
      handleReset();
    } catch (error) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addUser}>
      <Toaster position="top-right" />
      <div className={styles.pageHeader}>
        <div>
          <h1>Add New User</h1>
          <p>Invite a new teammate and assign access in seconds.</p>
        </div>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.sectionTitle}>
          <span>Profile Details</span>
          <div className={styles.sectionLine}></div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <div className={`${styles.inputWrapper} ${errors.name ? styles.error : ""}`}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <div className={`${styles.inputWrapper} ${errors.email ? styles.error : ""}`}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Mobile Number</label>
            <div className={`${styles.inputWrapper} ${errors.mobile ? styles.error : ""}`}>
              <FaBriefcase className={styles.inputIcon} />
              <input
                type="tel"
                name="mobile"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
            {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Role</label>
            <div className={`${styles.inputWrapper} ${errors.role ? styles.error : ""}`}>
              <FaUserShield className={styles.inputIcon} />
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Select a role</option>
                <option value="User">User</option>
                <option value="Developer">Developer</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            {errors.role && <span className={styles.errorText}>{errors.role}</span>}
          </div>
        </div>

        <div className={styles.formFooter}>
          <p className={styles.helperText}>
            An invite email will be sent after creating the user.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryBtn} onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? (
                <span className={styles.loaderContainer}>
                  <span className={styles.spinner}></span>
                  Creating...
                </span>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
