import { NavLink, Link } from "react-router-dom";
import styles from "./Header.module.css";

const navItems = [
  { to: "/", label: "홈" },
  { to: "/monthly", label: "이달의 부적" },
  { to: "/cards", label: "카드 도감" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} aria-label="역사적 인물 타로 홈">
          <span className={styles.brandMark} aria-hidden>
            HT
          </span>
          <span className={styles.brandText}>
            <strong>역사적 인물 타로</strong>
            <em>HISTORICA · TAROT</em>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
