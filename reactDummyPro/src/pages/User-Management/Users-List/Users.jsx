import { useState, useEffect } from "react";
import styles from "./Users.module.css";
import userList from "../../../data/userList.json";

function User() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    setUsers(userList);
  }, []);

  const handleToggle = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.userManagement}>
      <h1 className={styles.title}>Users List</h1>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name or email"
          className={styles.searchInput}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={
                    user.isActive ? styles.activeStatus : styles.inactiveStatus
                  }
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() => handleToggle(user.id)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? styles.activePage : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default User;
