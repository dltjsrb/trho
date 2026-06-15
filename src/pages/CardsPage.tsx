import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import TarotMini from "../components/TarotMini/TarotMini";
import { tarotCards } from "../data/tarotCards";
import type { TarotSuit } from "../types/tarot";
import styles from "./CardsPage.module.css";

type Filter = "all" | TarotSuit;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "major", label: "메이저" },
  { value: "wands", label: "완드" },
  { value: "cups", label: "컵" },
  { value: "swords", label: "소드" },
  { value: "pentacles", label: "펜타클" },
];

export default function CardsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return tarotCards.filter((c) => {
      const suit = c.suit ?? "major";
      if (filter !== "all" && suit !== filter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        c.nameKr.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q)) ||
        c.fun.luckyItem.toLowerCase().includes(q) ||
        (c.figure?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [filter, query]);

  return (
    <div className="container">
      <header className={styles.header}>
        <p className={styles.eyebrow}>CARD GRIMOIRE</p>
        <h1 className={styles.title}>78장의 인물 카드 도감</h1>
        <p className={styles.desc}>
          각 카드에는 한 명의 역사 인물과, 그 인물이 들려주는 부적 아이템 ·
          행운의 색 · 캐릭터 유형이 담겨 있습니다.
        </p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="tablist" aria-label="카드 분류">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              className={`${styles.chip} ${
                filter === f.value ? styles.chipActive : ""
              }`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className={styles.search}
          placeholder="카드 이름 · 키워드 · 인물 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="카드 검색"
        />
      </div>

      <p className={styles.count}>
        총 <strong>{filtered.length}</strong>장의 카드를 보고 있습니다
      </p>

      <motion.ul
        className={styles.grid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {filtered.map((card) => (
          <li key={card.id} className={styles.cell}>
            <TarotMini card={card} size="sm" />
            <p className={styles.keywords}>
              {card.keywords.slice(0, 3).map((k) => (
                <span key={k}>#{k}</span>
              ))}
            </p>
            {card.figure?.name && (
              <p className={styles.figure}>
                <span>인물</span>
                {card.figure.name}
              </p>
            )}
            <p className={styles.lucky}>
              <span>부적</span>
              {card.fun.luckyItem}
            </p>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
