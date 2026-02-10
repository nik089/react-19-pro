import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import styles from "./Dashboard.module.css";
import { fetchUsers } from "../../services/userService";

const ROLES = ["Admin", "Editor", "Viewer"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLORS = ["#667eea", "#764ba2", "#22c55e"];

const buildUsers = (data) =>
  data.map((user, index) => ({
    id: user.id,
    name: user.name,
    role: ROLES[index % ROLES.length],
    status: index % 4 === 0 ? "Inactive" : "Active",
    joined: MONTHS[index % MONTHS.length]
  }));

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsers();
        if (!isMounted) return;
        setUsers(buildUsers(data));
        setError("");
      } catch {
        if (!isMounted) return;
        setError("Unable to load users. Please try again.");
        toast.error("Unable to load users from API.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = totalUsers - activeUsers;

  const roleData = useMemo(
    () => ROLES.map((role) => ({
      name: role,
      value: users.filter((u) => u.role === role).length
    })),
    [users]
  );

  const monthlyData = useMemo(
    () => MONTHS.map((month) => ({
      month,
      users: users.filter((u) => u.joined === month).length
    })),
    [users]
  );

  return (
    <div className={styles.dashboard}>
      <h1>User Management Dashboard</h1>

      {isLoading && (
        <div className={styles.loadingState}>
          <span className={styles.loadingSpinner}></span>
          Loading user data...
        </div>
      )}

      {error && !isLoading && <div className={styles.errorState}>{error}</div>}

      {/* STATS */}
      <div className={styles.cards}>
        <div className={styles.card}><h3>Total Users</h3><p>{totalUsers}</p></div>
        <div className={styles.card}><h3>Active Users</h3><p>{activeUsers}</p></div>
        <div className={styles.card}><h3>Inactive Users</h3><p>{inactiveUsers}</p></div>
        <div className={styles.card}><h3>Admins</h3><p>{roleData[0]?.value || 0}</p></div>
      </div>

      {/* CHARTS */}
      <div className={styles.charts}>
        <div className={styles.chartBox}>
          <h3>Users Joined (Monthly)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartBox}>
          <h3>User Roles Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableSection}>
        <h3>Api User List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Role</th><th>Status</th><th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td className={u.status === "Active" ? styles.active : styles.inactive}>
                    {u.status}
                  </td>
                  <td>{u.joined}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
