import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TIMEFRAMES, type TimeframeKey } from "../utils/spread";
import styles from "./HomePage.module.css";

const TIMEFRAME_ORDER: TimeframeKey[] = ["week", "month", "year"];

export default function HomePage() {
  return (
    <div className="container">
      <motion.section
        className={styles.intro}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className={styles.eyebrow}>HISTORICA · TAROT</p>
        <h1 className={styles.title}>
          어떤 미래를
          <br />
          <span>들여다볼까요?</span>
        </h1>
        <p className={styles.lead}>
          78장의 덱에서 마음이 끌리는 3장을 직접 골라봅니다.
          <br />
          시간의 거리를 먼저 골라주세요. 그 안에서 펼쳐질 이야기를
          역사 속 인물들이 들려드립니다.
        </p>
      </motion.section>

      <motion.ul
        className={styles.timeframeGrid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
        }}
      >
        {TIMEFRAME_ORDER.map((key, i) => {
          const t = TIMEFRAMES[key];
          return (
            <motion.li
              key={key}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
            >
              <Link to={`/spread/${key}`} className={styles.tfCard}>
                <span className={styles.tfNum} aria-hidden>
                  0{i + 1}
                </span>
                <span className={styles.tfMeta}>
                  <strong className={styles.tfLabel}>{t.label}</strong>
                  <em className={styles.tfEnglish}>{t.englishLabel}</em>
                </span>
                <p className={styles.tfDesc}>{t.description}</p>

                <ol className={styles.tfPositions}>
                  {t.positions.map((p) => (
                    <li key={p.key}>
                      <span className={styles.tfPosLabel}>{p.label}</span>
                      <span className={styles.tfPosEng}>{p.englishLabel}</span>
                    </li>
                  ))}
                </ol>

                <span className={styles.tfArrow} aria-hidden>
                  3장 뽑으러 가기 →
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>

      <div className={styles.subLinks}>
        <Link to="/cards" className={styles.subLink}>
          78장 카드 도감
        </Link>
        <span className={styles.subDivider} aria-hidden>
          ·
        </span>
        <Link to="/monthly" className={styles.subLink}>
          이달의 부적 · 금기
        </Link>
      </div>
    </div>
  );
}
