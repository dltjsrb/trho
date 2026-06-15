import { motion } from "framer-motion";
import type { TarotCard, TarotOrientation } from "../../types/tarot";
import styles from "./TarotMini.module.css";

type Props = {
  card: TarotCard;
  orientation?: TarotOrientation;
  size?: "sm" | "md" | "lg";
};

export default function TarotMini({
  card,
  orientation = "upright",
  size = "md",
}: Props) {
  const isReversed = orientation === "reversed";

  return (
    <motion.div
      className={`${styles.card} ${styles[size]} ${
        isReversed ? styles.reversed : ""
      }`}
      whileHover={{ y: -4, rotateZ: isReversed ? -179 : -1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      aria-label={`${card.nameKr} (${isReversed ? "역방향" : "정방향"})`}
    >
      <div className={styles.imageWrap}>
        <img
          src={card.image}
          alt={card.nameKr}
          loading="lazy"
          className={styles.image}
        />
        <div className={styles.frame} aria-hidden />
        <span className={styles.cornerNum} aria-hidden>
          {card.number.toString().padStart(2, "0")}
        </span>
        <span className={styles.cornerTag} aria-hidden>
          {isReversed ? "REV" : "UP"}
        </span>
      </div>
      <div className={styles.meta}>
        <span className={styles.emoji} aria-hidden>
          {card.fun.emoji}
        </span>
        <div className={styles.names}>
          <strong>{card.nameKr}</strong>
          <em>{card.name}</em>
        </div>
      </div>
    </motion.div>
  );
}
