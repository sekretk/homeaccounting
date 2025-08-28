import { Route, Routes, Link } from 'react-router-dom';
import { ExpensePage } from './expense/Expense';
import styles from './app.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <h1 className={styles.logo}>🏠 Home Accounting</h1>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={styles.navLink}>Dashboard</Link>
            </li>
            <li>
              <Link to="/expense" className={styles.navLink}>💰 Expenses</Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.dashboard}>
                <div className={styles.welcomeCard}>
                  <h2>Welcome to Home Accounting</h2>
                  <p>Manage your personal finances with ease</p>
                  <div className={styles.quickActions}>
                    <Link to="/expense" className={styles.actionButton}>
                      💰 Manage Expenses
                    </Link>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/expense" element={<ExpensePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
