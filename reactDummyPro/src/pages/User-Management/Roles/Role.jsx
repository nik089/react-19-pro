import styles from "./Role.module.css";

function Role() {
  return (
    <div className={styles.role}>
      <h1>User Roles</h1>

      <div className={styles.roles}>
        <div className={styles.card}>
          <h3>Admin</h3>
          <p>Full access to system</p>
        </div>
        <div className={styles.card}>
          <h3>Editor</h3>
          <p>Can edit content</p>
        </div>
        <div className={styles.card}>
          <h3>Viewer</h3>
          <p>Read only access</p>
        </div>
      </div>
    </div>
  );
}

export default Role;
