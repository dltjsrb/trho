import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import MonthlyItems from "../components/MonthlyItems/MonthlyItems";
import { getMonthlyReading } from "../utils/monthlyTarot";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const reading = useMemo(() => getMonthlyReading(today), [today]);

  return (
    <div className="container">
      {/* ── Intro Hero ─────────────────────────────────────── */}
      <motion.section
        className={styles.intro}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.introInner}>
          <p className={styles.eyebrow}>HISTORICA · TAROT</p>
          <h1 className={styles.title}>
            역사 속 인물이 들려주는,
            <br />
            <span>이번 달의 부적과 금기</span>
          </h1>
          <p className={styles.lead}>
            78장의 타로 카드와 그 속에 깃든 역사 속 인물들이
            <br />
            이번 달 당신이 가까이 두면 좋은 물건과 멀리해야 할 물건을 알려줍니다.
          </p>

          <div className={styles.ctaRow}>
            <Link to="/monthly" className={`${styles.cta} ${styles.ctaPrimary}`}>
              이달의 부적 보기 →
            </Link>
            <Link to="/cards" className={styles.cta}>
              78장 도감 보기
            </Link>
          </div>

          <ul className={styles.stats}>
            <li>
              <strong>78</strong>
              <span>인물 카드</span>
            </li>
            <li>
              <strong>{reading.totalPower}</strong>
              <span>이달 운기</span>
            </li>
            <li>
              <strong>3 · 3</strong>
              <span>부적 / 금기</span>
            </li>
          </ul>
        </div>

        <div className={styles.scroll} aria-hidden>
          <span className={styles.scrollMark}>
            {String(reading.month).padStart(2, "0")}
          </span>
        </div>
      </motion.section>

      <div className="divider-seal">
        <span>THIS MONTH</span>
      </div>

      {/* ── Monthly result preview ─────────────────────────── */}
      <MonthlyItems initialDate={today} showHero />
    </div>
  );
}
