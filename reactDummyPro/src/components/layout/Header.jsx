import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import styles from "../layout-css/Header.module.css";

function Header({ showLogin = true, forceProfile = false }) {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    setIsAuth(localStorage.getItem("isAuth") === "true");

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className={styles.header}>
      <h2>User Management</h2>

      {!isAuth && !forceProfile ? (
        showLogin ? <button onClick={() => navigate("/login")}>Login</button> : null
      ) : (
        <div className={styles.profileWrapper} ref={dropdownRef}>
          <div
            className={styles.avatar}
            onClick={() => setOpen(!open)}
          >
            N
          </div>

          {open && (
            <div className={styles.dropdown}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
