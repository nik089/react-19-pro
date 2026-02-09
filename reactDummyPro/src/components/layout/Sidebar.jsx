import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaUserPlus, FaUserShield, FaCog } from "react-icons/fa";
import styles from "../layout-css/Sidebar.module.css";

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Admin Panel</h2>

      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <FaTachometerAlt /> <span>Dashboard</span>
        </NavLink>

        <div className={styles.sectionTitle}>User Management</div>

        <NavLink to="/users" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <FaUsers /> <span>Users List</span>
        </NavLink>

        <NavLink to="/add-user" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <FaUserPlus /> <span>Add User</span>
        </NavLink>

        <NavLink to="/roles" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <FaUserShield /> <span>Roles</span>
        </NavLink>

        <div className={styles.sectionTitle}>System</div>

        <NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : styles.link}>
          <FaCog /> <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
