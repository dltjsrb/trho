import { motion } from "framer-motion";
import TarotMini from "../TarotMini/TarotMini";
import type { MonthlyPick } from "../../types/tarot";
import styles from "./ItemCard.module.css";

type Props = {
  pick: MonthlyPick;
  kind: "carry" | "avoid";
  index: number;
};

const KIND_LABEL: Record<Props["kind"], { mark: string; title: string; sub: string }> = {
  carry: {
    mark: "✓",
    title: "가까이 두면 좋아요",
    sub: "Charm of the Month",
  },
  avoid: {
    mark: "✕",
    title: "잠시 거리를 두세요",
    sub: "Taboo of the Month",
  },
};

export default function ItemCard({ pick, kind, index }: Props) {
  const label = KIND_LABEL[kind];
  const figureName = pick.card.figure?.name;

  return (
    <motion.article
      className={`${styles.card} ${styles[kind]}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <header className={styles.head}>
        <span className={styles.mark} aria-hidden>
          {label.mark}
        </span>
        <div className={styles.headText}>
          <strong>{label.title}</strong>
          <em>{label.sub}</em>
        </div>
        <span className={styles.idx} aria-hidden>
          0{index + 1}
        </span>
      </header>

      <div className={styles.body}>
        <div className={styles.cardSlot}>
          <TarotMini card={pick.card} orientation={pick.orientation} size="md" />
        </div>

        <div className={styles.detail}>
          <div className={styles.itemBlock}>
            <span className={styles.itemLabel}>
              {kind === "carry" ? "이번 달 부적 아이템" : "이번 달 피할 아이템"}
            </span>
            <h3 className={styles.itemName}>
              <span className={styles.itemEmoji} aria-hidden>
                {pick.emoji}
              </span>
              {pick.item}
            </h3>
            <p className={styles.colorRow}>
              <span className={styles.colorDot} aria-hidden />
              행운의 색 — <strong>{pick.color}</strong>
            </p>
          </div>

          <div className={styles.reasonBlock}>
            <p className={styles.reason}>{pick.reason}</p>
            <p className={styles.character}>
              {figureName && (
                <span className={styles.figureTag}>{figureName}</span>
              )}
              {pick.card.fun.characterType}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
