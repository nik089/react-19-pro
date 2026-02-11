import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "../layout-css/Header.module.css";
import { useAuth } from "../../services/AuthContext";

function Header({ showLogin = true }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <h2><Link to="/" className={styles.logoLink}>User Management</Link></h2>

      {currentUser ? (
        <div className={styles.profileWrapper} ref={dropdownRef}>
          <div
            className={styles.avatar}
            onClick={() => setOpen(!open)}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </div>

          {open && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <p className={styles.userName}>{currentUser.name}</p>
                <p className={styles.userEmail}>{currentUser.email}</p>
              </div>
              <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className={styles.dropdownItem}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        showLogin && <button onClick={() => navigate("/login")}>Login</button>
      )}
    </header>
  );
}

export default Header;
