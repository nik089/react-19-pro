import styles from "./addUser.module.css";

function AddUser() {
  return (
    <div className={styles.addUser}>
      <h1>Add New User</h1>

      <div className={styles.card}>
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <select>
          <option>Admin</option>
          <option>Editor</option>
          <option>Viewer</option>
        </select>
        <button>Create User</button>
      </div>
    </div>
  );
}

export default AddUser;
