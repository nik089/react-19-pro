import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import styles from "./Dashboard.module.css";

// ==== DUMMY USER DATA ====
const users = [
    { id: 1, name: "Aarav", role: "Admin", status: "Active", joined: "Jan" },
    { id: 2, name: "Diya", role: "Editor", status: "Active", joined: "Feb" },
    { id: 3, name: "Kabir", role: "Viewer", status: "Inactive", joined: "Feb" },
    { id: 4, name: "Isha", role: "Editor", status: "Active", joined: "Mar" },
    { id: 5, name: "Vivaan", role: "Viewer", status: "Active", joined: "Apr" },
    { id: 6, name: "Anaya", role: "Admin", status: "Active", joined: "May" },
    { id: 7, name: "Reyansh", role: "Viewer", status: "Inactive", joined: "May" },
    { id: 8, name: "Sara", role: "Editor", status: "Active", joined: "Jun" },
];

// ==== BAR CHART (Users Joined Per Month) ====
const monthlyData = [
    { month: "Jan", users: 1 },
    { month: "Feb", users: 2 },
    { month: "Mar", users: 1 },
    { month: "Apr", users: 1 },
    { month: "May", users: 2 },
    { month: "Jun", users: 1 },
];

// ==== PIE CHART (Role Distribution) ====
const roleData = [
    { name: "Admin", value: 2 },
    { name: "Editor", value: 3 },
    { name: "Viewer", value: 3 },
];

const COLORS = ["#667eea", "#764ba2", "#22c55e"];

function Dashboard() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === "Active").length;
    const inactiveUsers = totalUsers - activeUsers;

    return (
        <div className={styles.dashboard}>
            <h1>User Management Dashboard</h1>

            {/* STATS */}
            <div className={styles.cards}>
                <div className={styles.card}><h3>Total Users</h3><p>{totalUsers}</p></div>
                <div className={styles.card}><h3>Active Users</h3><p>{activeUsers}</p></div>
                <div className={styles.card}><h3>Inactive Users</h3><p>{inactiveUsers}</p></div>
                <div className={styles.card}><h3>Admins</h3><p>{roleData[0].value}</p></div>
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
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
                <h3>User List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Role</th><th>Status</th><th>Joined</th>
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
                                <td>{u.joined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
