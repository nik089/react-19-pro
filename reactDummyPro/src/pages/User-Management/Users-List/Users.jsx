import styles from "./Users.module.css";

const users = [
  { id: 1, name: "Aarav", role: "Admin", status: "Active" },
  { id: 2, name: "Diya", role: "Editor", status: "Active" },
  { id: 3, name: "Kabir", role: "Viewer", status: "Inactive" },
];

function User() {
  return (
    <div className={styles.user}>
      <h1>Users List</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Role</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td className={u.status === "Active" ? styles.active : styles.inactive}>
                {u.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;
