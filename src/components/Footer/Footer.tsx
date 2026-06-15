import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.row}>
          <span className={styles.brand} aria-hidden>
            HISTORICA · TAROT
          </span>
          <p>
            역사적 인물 타로 — 78장의 카드와 78인의 역사 속 인물이 들려주는 한 달의 이야기
          </p>
          <span className={styles.copy}>
            © {new Date().getFullYear()} HISTORICA TAROT
          </span>
        </div>
      </div>
    </footer>
  );
}
