import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ItemCard from "../ItemCard/ItemCard";
import { getMonthlyReading } from "../../utils/monthlyTarot";
import styles from "./MonthlyItems.module.css";

type Props = {
  initialDate?: Date;
  /** 상단의 큰 헤더(영문 부제, 점수 배지 등)를 표시할지 여부 */
  showHero?: boolean;
};

export default function MonthlyItems({
  initialDate = new Date(),
  showHero = true,
}: Props) {
  const [date, setDate] = useState(initialDate);

  const reading = useMemo(() => getMonthlyReading(date), [date]);

  const shiftMonth = (delta: number) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + delta);
    setDate(next);
  };

  const monthLabel = `${reading.month}월`;
  const monthSeal = String(reading.month).padStart(2, "0");

  return (
    <section className={styles.section}>
      {showHero && (
        <motion.header
          className={styles.hero}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.heroSeal} aria-hidden>
            {monthSeal}
          </span>
          <div className={styles.heroText}>
            <p className={styles.heroEyebrow}>이번 달의 부적과 금기</p>
            <h1 className={styles.heroTitle}>
              <span>{reading.year}년</span> {monthLabel}의 길흉
            </h1>
            <p className={styles.heroFigure}>
              이번 달의 인물 — {reading.figureName}
            </p>
          </div>
          <div className={styles.heroPower}>
            <span className={styles.powerLabel}>이달의 운기</span>
            <strong className={styles.powerValue}>{reading.totalPower}</strong>
            <span className={styles.powerUnit}>POWER</span>
          </div>
        </motion.header>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => shiftMonth(-1)}
        >
          ← 지난 달
        </button>
        <span className={styles.currentMonth}>
          {reading.year}.{String(reading.month).padStart(2, "0")} · {monthLabel}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => shiftMonth(1)}
        >
          다음 달 →
        </button>
      </div>

      {/* ─── 챙기면 좋은 아이템 ─── */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span className={styles.groupMark} aria-hidden>
            ✓
          </span>
          <div>
            <h2 className={styles.groupTitle}>이번 달 챙기면 좋은 부적</h2>
            <p className={styles.groupSub}>{reading.carryAdvice}</p>
          </div>
        </div>
        <div className={styles.list}>
          {reading.carry.map((pick, i) => (
            <ItemCard key={pick.card.id} pick={pick} kind="carry" index={i} />
          ))}
        </div>
      </div>

      <div className="divider-seal">
        <span>TABOO</span>
      </div>

      {/* ─── 피하면 좋은 아이템 ─── */}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span className={`${styles.groupMark} ${styles.markRed}`} aria-hidden>
            ✕
          </span>
          <div>
            <h2 className={styles.groupTitle}>이번 달 멀리하면 좋은 것</h2>
            <p className={styles.groupSub}>{reading.avoidAdvice}</p>
          </div>
        </div>
        <div className={styles.list}>
          {reading.avoid.map((pick, i) => (
            <ItemCard key={pick.card.id} pick={pick} kind="avoid" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
