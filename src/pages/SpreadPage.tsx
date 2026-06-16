import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TarotMini from "../components/TarotMini/TarotMini";
import {
  buildReading,
  buildSynthesis,
  getTimeframe,
  randomOrientation,
  shuffleDeck,
  type SpreadCard,
  type Timeframe,
} from "../utils/spread";
import type { TarotCard, TarotOrientation } from "../types/tarot";
import styles from "./SpreadPage.module.css";

type Stage = "shuffling" | "picking" | "revealing" | "revealed";
type Picked = { card: TarotCard; orientation: TarotOrientation };

const FAN_SIZE = 22;
const SHUFFLE_DURATION = 1100;
const REVEAL_DELAY_PER_CARD = 0.45;

export default function SpreadPage() {
  const { timeframe: timeframeKey } = useParams<{ timeframe: string }>();
  const timeframe = getTimeframe(timeframeKey);

  if (!timeframe) {
    return <Navigate to="/" replace />;
  }

  return <SpreadView timeframe={timeframe} />;
}

function SpreadView({ timeframe }: { timeframe: Timeframe }) {
  const [deck, setDeck] = useState<TarotCard[]>(() => shuffleDeck(FAN_SIZE));
  const [picked, setPicked] = useState<Picked[]>([]);
  const [stage, setStage] = useState<Stage>("shuffling");

  // ── 타임프레임이 바뀌면 상태 초기화 (다른 시간 보기로 이동했을 때)
  useEffect(() => {
    setPicked([]);
    setDeck(shuffleDeck(FAN_SIZE));
    setStage("shuffling");
  }, [timeframe.key]);

  // ── 셔플 → 픽
  useEffect(() => {
    if (stage !== "shuffling") return;
    const t = setTimeout(() => setStage("picking"), SHUFFLE_DURATION);
    return () => clearTimeout(t);
  }, [stage]);

  // ── 3장 모이면 reveal
  useEffect(() => {
    if (stage !== "picking" || picked.length !== 3) return;
    const t = setTimeout(() => setStage("revealing"), 550);
    return () => clearTimeout(t);
  }, [picked.length, stage]);

  // ── reveal 끝
  useEffect(() => {
    if (stage !== "revealing") return;
    const totalMs = (REVEAL_DELAY_PER_CARD * 3 + 0.6) * 1000;
    const t = setTimeout(() => setStage("revealed"), totalMs);
    return () => clearTimeout(t);
  }, [stage]);

  const handlePick = (card: TarotCard) => {
    if (stage !== "picking" || picked.length >= 3) return;
    if (picked.some((p) => p.card.id === card.id)) return;

    setPicked((prev) => [...prev, { card, orientation: randomOrientation() }]);
    setDeck((prev) => prev.filter((c) => c.id !== card.id));
  };

  const handleReshuffle = () => {
    setPicked([]);
    setDeck(shuffleDeck(FAN_SIZE));
    setStage("shuffling");
  };

  const stepIndex =
    stage === "shuffling" ? 0 : stage === "picking" ? 1 : 2;

  // ── 3장이 모두 픽 완료됐을 때 종합 해설 데이터 준비
  const synthesis =
    stage === "revealed" && picked.length === 3
      ? (() => {
          const spreadCards: SpreadCard[] = picked.map((p, i) => ({
            position: timeframe.positions[i],
            card: p.card,
            orientation: p.orientation,
            reading: buildReading(p.card, p.orientation, timeframe.positions[i]),
          }));
          return buildSynthesis(spreadCards, timeframe);
        })()
      : null;

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← 다른 시간 보기
        </Link>
        <p className={styles.eyebrow}>
          {timeframe.englishLabel.toUpperCase()} · THREE CARD SPREAD
        </p>
        <h1 className={styles.title}>
          <span>{timeframe.label}</span>의 이야기
        </h1>
        <p className={styles.desc}>{timeframe.story}</p>

        <ol className={styles.steps} aria-label="진행 단계">
          {[
            { num: "01", label: "셔플" },
            { num: "02", label: "선택" },
            { num: "03", label: "결과" },
          ].map((s, i) => (
            <li
              key={s.label}
              className={`${styles.step} ${
                i === stepIndex ? styles.stepActive : ""
              } ${i < stepIndex ? styles.stepDone : ""}`}
              aria-current={i === stepIndex ? "step" : undefined}
            >
              <span className={styles.stepNum}>{s.num}</span>
              {s.label}
            </li>
          ))}
        </ol>
      </header>

      {/* ── 결과 슬롯 ─────────────────────────────────── */}
      <ul className={styles.slots}>
        {timeframe.positions.map((pos, i) => {
          const pick = picked[i];
          const card = pick?.card;
          const orientation = pick?.orientation;
          const isReady = stage === "revealing" || stage === "revealed";
          const reading =
            card && orientation
              ? buildReading(card, orientation, pos)
              : null;
          const showFront = isReady && card && orientation;

          return (
            <li key={pos.key} className={styles.slot}>
              <div className={styles.slotHeader}>
                <span className={styles.slotIndex}>0{i + 1}</span>
                <div>
                  <strong className={styles.slotLabel}>{pos.label}</strong>
                  <em className={styles.slotEnglish}>{pos.englishLabel}</em>
                </div>
              </div>
              <p className={styles.slotHint}>{pos.hint}</p>

              <div className={styles.slotCardArea}>
                <AnimatePresence mode="wait">
                  {showFront && card && orientation ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{
                        duration: 0.55,
                        delay: i * REVEAL_DELAY_PER_CARD,
                        ease: "easeOut",
                      }}
                      className={styles.slotFront}
                    >
                      <TarotMini
                        card={card}
                        orientation={orientation}
                        size="md"
                      />
                    </motion.div>
                  ) : pick ? (
                    <motion.div
                      key="back"
                      initial={{ scale: 0.6, opacity: 0, y: -30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className={styles.slotBack}
                      aria-hidden
                    >
                      <span className={styles.cardBackMark}>HT</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={styles.slotEmpty}
                      aria-hidden
                    >
                      <span>?</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {showFront && reading && card && orientation && (
                  <motion.div
                    key="reading"
                    className={styles.reading}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.55 + i * REVEAL_DELAY_PER_CARD,
                      duration: 0.4,
                    }}
                  >
                    <p className={styles.cardName}>
                      <strong>{card.nameKr}</strong>
                      <em>
                        {card.name} ·{" "}
                        {orientation === "upright" ? "정방향" : "역방향"}
                      </em>
                    </p>

                    {card.figure?.name && (
                      <p className={styles.figureRow}>
                        <span className={styles.figureTag}>인물</span>
                        <span>
                          <strong>{card.figure.name}</strong>
                          {card.figure.era && (
                            <em> · {card.figure.era}</em>
                          )}
                        </span>
                      </p>
                    )}

                    <h3 className={styles.readingTitle}>{reading.title}</h3>
                    <p className={styles.readingBody}>{reading.body}</p>
                    <p className={styles.readingNote}>{reading.note}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* ── 종합 해설 (3장이 모두 공개된 뒤) ─────────── */}
      <AnimatePresence>
        {synthesis && (
          <motion.section
            key="synthesis"
            className={`${styles.synthesis} ${styles[`tone_${synthesis.tone}`]}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <header className={styles.synthHeader}>
              <span className={styles.synthEyebrow}>
                CHAPTER · {timeframe.label}의 한 장(章)
              </span>
              <h2 className={styles.synthHeadline}>{synthesis.headline}</h2>
            </header>

            {synthesis.guideLine && (
              <p className={styles.synthGuide}>
                <span className={styles.synthLabel}>등장 인물</span>
                {synthesis.guideLine}
              </p>
            )}

            <p className={styles.synthFlow}>{synthesis.flowLine}</p>

            <div className={styles.synthBody}>
              {synthesis.paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.18,
                    duration: 0.4,
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <motion.p
              className={styles.synthAdvice}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.4 }}
            >
              <span className={styles.synthLabel}>맺음말</span>
              {synthesis.advice}
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── 타로 테이블 ─────────────────────────────── */}
      <section className={styles.table} aria-live="polite">
        {stage === "shuffling" && (
          <div className={styles.shuffleArea}>
            <p className={styles.tableTitle}>카드를 섞고 있습니다…</p>
            <div className={styles.shufflePile}>
              {[0, 1, 2, 3, 4].map((n) => (
                <motion.div
                  key={n}
                  className={styles.shuffleCard}
                  style={{ zIndex: 5 - n }}
                  animate={{
                    x: [0, n % 2 === 0 ? -60 : 60, 0],
                    y: [0, -10, 0],
                    rotate: [0, n % 2 === 0 ? -10 : 10, 0],
                  }}
                  transition={{
                    duration: 1.0,
                    repeat: Infinity,
                    delay: n * 0.08,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {stage === "picking" && (
          <div className={styles.pickArea}>
            <div className={styles.tableTitleRow}>
              <p className={styles.tableTitle}>마음이 끌리는 카드를 골라주세요</p>
              <span className={styles.tableCount}>
                {picked.length} / 3
              </span>
            </div>

            <div className={styles.fan} role="listbox" aria-label="타로 카드 부채꼴">
              {deck.map((card, idx) => {
                const total = deck.length;
                const t = total <= 1 ? 0 : idx / (total - 1) - 0.5;
                const rot = t * 24;
                const lift = -Math.abs(t) * 8;
                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    className={styles.fanCard}
                    style={{
                      transform: `translateY(${lift}px) rotate(${rot}deg)`,
                    }}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { delay: idx * 0.025, duration: 0.4 },
                    }}
                    whileHover={{ y: -22, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handlePick(card)}
                    aria-label={`카드 ${idx + 1}번 선택`}
                  >
                    <span className={styles.fanCardInner}>
                      <span className={styles.fanCardMark}>HT</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className={styles.tableActions}>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={handleReshuffle}
              >
                ↻ 다시 섞기
              </button>
            </div>
          </div>
        )}

        {(stage === "revealing" || stage === "revealed") && (
          <div className={styles.resultArea}>
            <p className={styles.tableTitle}>
              {stage === "revealing"
                ? "카드가 한 장씩 모습을 드러냅니다…"
                : `${timeframe.label}의 이야기가 모두 펼쳐졌습니다`}
            </p>
            {stage === "revealed" && (
              <>
                <div className={styles.tableActions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleReshuffle}
                  >
                    ↻ 다시 뽑기
                  </button>
                  <Link to="/" className={styles.btnGhost}>
                    ← 다른 시간 보기
                  </Link>
                </div>
                <p className={styles.footnote}>
                  ※ 타로는 미래를 정해주는 도구가 아니라, 지금 내 흐름을 비춰주는
                  거울입니다.
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
