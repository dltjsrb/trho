import { tarotCards } from "../data/tarotCards";
import type { TarotCard, TarotOrientation } from "../types/tarot";

export type SpreadPositionKey = string;

export type SpreadPosition = {
  key: SpreadPositionKey;
  label: string;
  englishLabel: string;
  hint: string;
};

export type SpreadCard = {
  position: SpreadPosition;
  card: TarotCard;
  orientation: TarotOrientation;
  reading: {
    title: string;
    body: string;
    note: string;
  };
};

/* ────────────────────────────────────────────────────────────
 *  타임프레임 — 1주일 / 1달 / 1년
 *  각 프레임마다 3장의 자리(position)가 다른 의미를 가집니다.
 * ──────────────────────────────────────────────────────────── */

export type TimeframeKey = "week" | "month" | "year";

export type Timeframe = {
  key: TimeframeKey;
  label: string;
  englishLabel: string;
  description: string;
  story: string;
  positions: [SpreadPosition, SpreadPosition, SpreadPosition];
};

export const TIMEFRAMES: Record<TimeframeKey, Timeframe> = {
  week: {
    key: "week",
    label: "1주일 후",
    englishLabel: "Next Week",
    description: "가까운 미래의 흐름을 한 장씩 따라가봅니다.",
    story:
      "이번 주를 어떻게 시작하고, 어떻게 흘러가며, 어떻게 마무리되는지 — 세 장으로 일주일의 이야기를 들어봅니다.",
    positions: [
      {
        key: "start",
        label: "주의 시작",
        englishLabel: "Beginning",
        hint: "이번 주를 여는 마음과 분위기",
      },
      {
        key: "flow",
        label: "주의 흐름",
        englishLabel: "Flow",
        hint: "한 주를 관통하는 가장 중요한 흐름",
      },
      {
        key: "end",
        label: "주의 끝",
        englishLabel: "End",
        hint: "주말로 향하며 닿게 될 작은 결말",
      },
    ],
  },
  month: {
    key: "month",
    label: "1달 후",
    englishLabel: "Next Month",
    description: "한 달 안에 마주할 큰 그림을 펼칩니다.",
    story:
      "한 달의 큰 그림 / 조심해야 할 신호 / 끝에 손에 남는 결실 — 세 장으로 한 달의 이야기를 그려봅니다.",
    positions: [
      {
        key: "scene",
        label: "큰 그림",
        englishLabel: "Big Picture",
        hint: "한 달 전체를 관통하는 분위기",
      },
      {
        key: "watch",
        label: "주의할 것",
        englishLabel: "Watch Out",
        hint: "이 한 달 동안 가장 조심해야 할 신호",
      },
      {
        key: "fruit",
        label: "결실",
        englishLabel: "Fruit",
        hint: "한 달이 지난 뒤 손에 남는 것",
      },
    ],
  },
  year: {
    key: "year",
    label: "1년 후",
    englishLabel: "Next Year",
    description: "한 해의 줄기와 도착할 풍경을 봅니다.",
    story:
      "토대 / 도전 / 도착할 풍경 — 세 장으로 한 해의 큰 줄기를 들여다봅니다.",
    positions: [
      {
        key: "foundation",
        label: "토대",
        englishLabel: "Foundation",
        hint: "이번 한 해의 출발점이 되는 자리",
      },
      {
        key: "challenge",
        label: "도전",
        englishLabel: "Challenge",
        hint: "한 해를 가르는 가장 큰 과제",
      },
      {
        key: "horizon",
        label: "도착할 풍경",
        englishLabel: "Horizon",
        hint: "한 해 끝에 보이는 풍경",
      },
    ],
  },
};

export function getTimeframe(key: string | undefined): Timeframe | undefined {
  if (key === "week" || key === "month" || key === "year") {
    return TIMEFRAMES[key];
  }
  return undefined;
}

/* 호환용: 예전 시그니처에서 사용하던 기본 3-position 배열 */
export const SPREAD_POSITIONS: SpreadPosition[] = [
  ...TIMEFRAMES.week.positions,
];

/**
 * 카드 + 정/역 + 자리 정보를 받아 화면에 보여줄 해석 텍스트를 만듭니다.
 */
export function buildReading(
  card: TarotCard,
  orientation: TarotOrientation,
  position: SpreadPosition
): SpreadCard["reading"] {
  if (orientation === "upright") {
    return {
      title: card.upright.title,
      body: card.upright.description,
      note: `${position.label}의 키워드 — ${card.keywords.slice(0, 3).join(" · ")}`,
    };
  }
  return {
    title: card.reversed.title,
    body: card.reversed.description,
    note: card.reversed.warning,
  };
}

/**
 * 78장 덱에서 무작위로 size장을 셔플해서 반환합니다.
 */
export function shuffleDeck(size = 22): TarotCard[] {
  const deck = [...tarotCards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, Math.min(size, deck.length));
}

/** 정/역방향을 무작위로 결정해 반환합니다 (50/50). */
export function randomOrientation(): TarotOrientation {
  return Math.random() < 0.5 ? "upright" : "reversed";
}

/**
 * 자동으로 3장을 뽑아 SpreadCard 배열로 반환합니다.
 * (호환용 — 사용자 픽 모드를 쓰지 않을 때)
 */
export function drawThreeCards(timeframeKey?: TimeframeKey): SpreadCard[] {
  const timeframe = timeframeKey
    ? TIMEFRAMES[timeframeKey]
    : TIMEFRAMES.week;
  const shuffled = shuffleDeck(tarotCards.length);
  return timeframe.positions.map((position, i) => {
    const card = shuffled[i];
    const orientation = randomOrientation();
    return {
      position,
      card,
      orientation,
      reading: buildReading(card, orientation, position),
    };
  });
}

/* ────────────────────────────────────────────────────────────
 *  종합 해설 (Synthesis)
 *  3장의 카드를 묶어 하나의 이야기로 엮어줍니다.
 * ──────────────────────────────────────────────────────────── */

export type SpreadTone = "bright" | "balanced" | "challenging";

export type SpreadSynthesis = {
  headline: string;
  guideLine: string | null;
  flowLine: string;
  paragraphs: string[];
  advice: string;
  tone: SpreadTone;
};

/* ── 한국어 조사 헬퍼 (받침 유무에 따라 이/가, 은/는, 을/를) ── */
function hasJongseong(ch: string | undefined): boolean {
  if (!ch) return false;
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}
function josa(word: string, withFinal: string, withoutFinal: string): string {
  return hasJongseong(word[word.length - 1]) ? withFinal : withoutFinal;
}

function getTone(picks: SpreadCard[]): SpreadTone {
  const uprightCount = picks.filter((p) => p.orientation === "upright").length;
  if (uprightCount >= 2) return "bright";
  if (uprightCount === 0) return "challenging";
  return "balanced";
}

/* ── 카드/인물 데이터 추출 도우미 ─────────────────────── */
function focusOf(p: SpreadCard): string {
  return p.orientation === "upright"
    ? p.card.upright.title
    : p.card.reversed.title;
}

/** 인물 소개구를 한 문장으로 — "(era), (region), (summary)" 자연스럽게 이어붙입니다. */
function figureClause(p: SpreadCard): string {
  const f = p.card.figure;
  if (!f) return "";
  const parts: string[] = [];
  if (f.era) parts.push(f.era);
  if (f.region) parts.push(`${f.region}의 사람`);
  const head = parts.join(", ");
  const body = f.summary ? ` ${f.summary}` : "";
  return head ? `${head}.${body}` : body.trim();
}

/* ── 헤드라인 (챕터의 한 줄 부제처럼) ──────────────────── */
const HEADLINE_BY_TONE: Record<SpreadTone, () => string> = {
  bright: () => "빛이 천천히 자기 자리를 찾아가는, 그런 시간이다.",
  balanced: () => "빛과 그림자가 번갈아 드는, 두 얼굴의 시간이다.",
  challenging: () =>
    "결코 가벼울 수 없으나, 그 자리에서 가장 깊이 배우게 되는 시간이다.",
};

/* ── 마무리 조언 (장 끝에 덧붙는 한 단락의 느낌) ─────── */
const ADVICE_MATRIX: Record<TimeframeKey, Record<SpreadTone, string>> = {
  week: {
    bright:
      "한 주의 흐름이 당신의 손을 가볍게 받쳐 줄 것이다. 작은 결심 하나라도 미루지 말 일이다.",
    balanced:
      "들쭉날쭉한 한 주에는 매일의 짧은 점검 한 번이 결국 흐름을 정돈해 준다.",
    challenging:
      "이번 주는 결과를 좇기보다 마음의 자세를 지키는 일이 먼저다. 무리하지 않아도 충분하다.",
  },
  month: {
    bright:
      "한 달 안에 매듭짓고 싶은 일이 있다면, 진심을 담아 시간을 쏟아도 좋은 흐름이다.",
    balanced:
      "한 달의 큰 그림과 매일의 호흡, 두 개의 시계를 함께 들여다보아야 균형이 잡힌다.",
    challenging:
      "이 한 달은 ‘덜어내는 달’로 두라. 새로 벌이기보다 정리에 마음을 모을 때 다음 달이 한결 가벼워진다.",
  },
  year: {
    bright:
      "올해는 흐름을 타고 한 단계 더 큰 그림을 그려 보아도 좋은 해다.",
    balanced:
      "올해는 계절마다 다른 얼굴로 당신 앞에 설 것이다. 그 변화에 자기를 맞추어 가는 한 해가 된다.",
    challenging:
      "올해는 토대를 다지는 해로 두라. 눈에 보이지 않는 그 시간이 결국 다음 해의 큰 풍경을 짓는다.",
  },
};

/* ── 위치별 도입어 (각 시간대의 첫 문장 톤을 잡아줍니다) ─ */
const POSITION_OPENERS: Record<TimeframeKey, [string, string, string]> = {
  week: [
    "한 주의 첫 자리에는",
    "한 주의 한가운데에는",
    "한 주의 끝자리에는",
  ],
  month: [
    "한 달의 펼쳐진 큰 그림 속에는",
    "그 흐름 한가운데에는",
    "한 달이 닫히는 자리에는",
  ],
  year: [
    "한 해의 첫 돌이 놓이는 자리에는",
    "한 해를 가로지르는 큰 길목에는",
    "한 해의 끝에 닿으면 그 자리에는",
  ],
};

/* ── 두 번째 문장 — 인물의 시대를 카드 의미에 잇는 ‘책의 전환구’ ─ */
const POSITION_BRIDGE: Record<TimeframeKey, [string, string, string]> = {
  week: [
    "그가 한 시대에 남긴 흔적은, 당신의 한 주가 어떤 결로 열리는지를 가만히 일러준다",
    "그 옛 사람의 길이 곧, 이 한 주의 한가운데를 채우는 흐름이 된다",
    "그가 도달한 자리의 풍경이, 이 한 주가 끝내 닿게 되는 마지막 장면이다",
  ],
  month: [
    "그가 살아낸 시대의 결이, 이 한 달의 토대 위에 그대로 새겨진다",
    "그 옛 인물이 마주했던 결단의 무게가, 이번 한 달의 한복판에서 다시 떠오른다",
    "그가 남긴 풍경이, 이 한 달이 당신에게 건네주는 마지막 결실이 된다",
  ],
  year: [
    "그가 디딘 자리의 무게가, 당신의 한 해를 떠받치는 첫 돌이 된다",
    "그 옛 인물의 결단이, 한 해를 가르는 가장 큰 장면으로 다시 세워진다",
    "그가 도달한 자리의 풍경이, 당신의 한 해가 끝내 도착하는 종착이 된다",
  ],
};

/**
 * 한 장의 카드를 한 단락의 ‘역사 서술체’ 문단으로 변환합니다.
 *
 *   [위치 도입어] [인물 이름]이/가 (서/자리하/기다리)…
 *   [시대·지역·행적 요약]
 *   [전환구] — ‘[카드의 핵심 키워드]’.
 */
function paragraphFor(
  p: SpreadCard,
  index: number,
  timeframe: Timeframe
): string {
  const opener = POSITION_OPENERS[timeframe.key][index];
  const bridge = POSITION_BRIDGE[timeframe.key][index];

  const f = p.card.figure;
  const focus = focusOf(p);
  const oriNote = p.orientation === "reversed" ? " (역방향의 결로)" : "";

  // 동사: 위치별로 살짝 다른 동사를 써 책의 호흡감을 만듭니다.
  const verbs: [string, string, string] = ["서 있다", "자리한다", "기다린다"];
  const verb = verbs[index];

  if (f) {
    const subject = `${f.name}${josa(f.name, "이", "가")}`;
    const profile = figureClause(p);
    return `${opener} ${subject} ${verb}${oriNote}. ${profile} ${bridge} — ‘${focus}’.`;
  }

  // figure가 없는 카드를 위한 폴백 (현재 모든 78장에 figure 있음)
  const cardSubject = `‘${p.card.nameKr}’ 카드${josa(p.card.nameKr, "이", "가")}`;
  return `${opener} ${cardSubject} ${verb}${oriNote}. ${bridge} — ‘${focus}’.`;
}

/**
 * 3장의 카드를 묶어 하나의 종합 해설을 만듭니다.
 * 결과의 문체는 ‘역사책의 한 장(章)을 펼친 듯한’ 서술체입니다.
 */
export function buildSynthesis(
  picks: SpreadCard[],
  timeframe: Timeframe
): SpreadSynthesis {
  const tone = getTone(picks);

  const headline = HEADLINE_BY_TONE[tone]();

  const flowLine = picks
    .map(
      (p) =>
        `${p.card.nameKr}${p.orientation === "reversed" ? " (역)" : ""}`
    )
    .join("  →  ");

  const figureNames = picks
    .map((p) => p.card.figure?.name)
    .filter((name): name is string => Boolean(name));
  const guideLine =
    figureNames.length === picks.length ? figureNames.join("  ·  ") : null;

  const paragraphs = picks.map((p, i) => paragraphFor(p, i, timeframe));

  const advice = ADVICE_MATRIX[timeframe.key][tone];

  return {
    headline,
    guideLine,
    flowLine,
    paragraphs,
    advice,
    tone,
  };
}
