import { useNavigate } from "react-router-dom";
import styles from "../layout-css/Header.module.css";

function Header({ showLogin }) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <h2>React Admin</h2>

      {showLogin && (
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </header>
  );
}

export default Header;
