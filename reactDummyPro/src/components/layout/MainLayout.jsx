import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import styles from "../layout-css/MainLayout.module.css";

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header showLogin={false} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
