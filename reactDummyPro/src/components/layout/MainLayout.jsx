import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "../layout-css/MainLayout.module.css";

function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header showLogin={false} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />  
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
