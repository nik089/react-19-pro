import styles from "../layout-css/Sidebar.module.css";

function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <p>Dashboard</p>
            <p>Users</p>
        </aside>
    );
}

export default Sidebar;
