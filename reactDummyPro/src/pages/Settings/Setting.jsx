import styles from "./Setting.module.css";

function Setting() {
  return (
    <div className={styles.setting}>
      <h1>System Settings</h1>

      <div className={styles.card}>
        <h3>Profile Settings</h3>
        <div className={styles.form}>
          <input type="text" placeholder="Admin Name" />
          <input type="email" placeholder="Admin Email" />
          <button>Save Changes</button>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Security</h3>
        <div className={styles.form}>
          <input type="password" placeholder="New Password" />
          <input type="password" placeholder="Confirm Password" />
          <button>Update Password</button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
