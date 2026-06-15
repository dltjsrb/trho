import { tarotCards } from "../data/tarotCards";
import type {
  MonthlyPick,
  MonthlyReading,
  TarotCard,
} from "../types/tarot";

// 달마다 다른 결과지만, 같은 달이면 항상 같은 결과가 나오도록
// year / month 를 시드로 쓰는 결정적(deterministic) 의사난수 함수
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWith<T>(arr: T[], rand: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 중복 아이템 제거를 위해 카드를 충분히 뽑아두고
// 같은 luckyItem 이 carry/avoid 양쪽에 등장하지 않도록 필터링
function pickUniqueByItem(cards: TarotCard[], count: number, used: Set<string>) {
  const picked: TarotCard[] = [];
  for (const c of cards) {
    if (picked.length >= count) break;
    const key = c.fun.luckyItem.trim();
    if (used.has(key)) continue;
    used.add(key);
    picked.push(c);
  }
  return picked;
}

// 월별 분위기를 안내하는 역사 속 인물 — 한국사와 세계사를 섞어서 12명
const MONTHLY_FIGURES: Record<number, string> = {
  1: "세종대왕",
  2: "잔 다르크",
  3: "유관순",
  4: "레오나르도 다 빈치",
  5: "신사임당",
  6: "알렉산드로스 대왕",
  7: "이순신",
  8: "클레오파트라",
  9: "공자",
  10: "정약용",
  11: "마리 퀴리",
  12: "윈스턴 처칠",
};

function carryAdviceFor(month: number) {
  const adviceMap: Record<number, string> = {
    1: "한 해의 첫걸음, 새 기운을 받아들이기 위한 부적을 가까이 두세요.",
    2: "차가운 공기 속 마음을 따뜻하게 지켜줄 작은 물건이 큰 힘이 됩니다.",
    3: "변화의 바람이 부는 달, 가벼우면서도 의지가 되는 물건을 챙기세요.",
    4: "흐름이 빨라지는 달, 중심을 잡아주는 작은 물건이 운기를 안정시킵니다.",
    5: "활기가 넘치는 달, 부적이 곁에 있으면 행동의 무게가 가벼워집니다.",
    6: "감정이 일렁이기 쉬운 달, 마음을 가라앉혀 줄 물건을 챙겨두세요.",
    7: "에너지가 가장 강한 달, 그 힘을 잘 다루어 줄 부적을 곁에 두세요.",
    8: "유혹과 기회가 함께 오는 달, 자기를 지켜줄 물건이 필요합니다.",
    9: "마음을 정리하는 달, 차분함을 깊게 해줄 부적이 잘 어울립니다.",
    10: "그림자가 길어지는 달, 빛이 되어줄 작은 물건을 가까이 두세요.",
    11: "고요함이 깊어지는 달, 안정감을 주는 물건이 행운을 부릅니다.",
    12: "한 해를 마무리하는 달, 따뜻하고 단단한 기운을 곁에 두세요.",
  };
  return adviceMap[month] ?? "이번 달의 운기를 단단히 지켜줄 부적을 곁에 두세요.";
}

function avoidAdviceFor(month: number) {
  const adviceMap: Record<number, string> = {
    1: "낡은 기운이 남은 물건은 잠시 거리를 두는 것이 좋습니다.",
    2: "차가운 마음을 더 차갑게 만드는 물건은 잠시 멀리하세요.",
    3: "마음을 흔드는 자극적인 물건은 이번 달 운기를 흐트러뜨립니다.",
    4: "흐름을 막는 무거운 물건은 한 달간 멀리하는 것이 좋습니다.",
    5: "충동을 부추기는 물건은 잠시 서랍 속으로 넣어두세요.",
    6: "감정을 부풀리는 물건은 비 그치는 달까지 미뤄두는 것이 좋습니다.",
    7: "지나치게 자극적인 물건은 강한 기운과 부딪힐 수 있습니다.",
    8: "유혹의 기운을 부르는 물건은 이번 달엔 가까이 두지 마세요.",
    9: "쓸데없이 시선을 끄는 물건은 마음을 흩어 놓을 수 있습니다.",
    10: "지친 마음을 더 어둡게 만드는 물건은 잠시 정리하는 게 좋습니다.",
    11: "흐름이 막힌 낡은 물건은 잠시 보관함 속에 넣어두세요.",
    12: "차갑고 텅 빈 느낌의 물건은 마무리의 달과 어울리지 않습니다.",
  };
  return (
    adviceMap[month] ??
    "기운이 흐트러진 물건은 잠시 거리를 두는 것이 좋습니다."
  );
}

function calcTotalPower(picks: MonthlyPick[]) {
  // 단순히 카드 번호 / suit 분포를 기반으로 0~99 사이의 한 달 운기 점수를 계산
  const base = picks.reduce((acc, p) => acc + (p.card.number + 1) * 3, 0);
  return Math.min(99, 30 + (base % 70));
}

/**
 * 주어진 날짜(기본값: 오늘)의 연/월을 기준으로
 * - 이번 달에 챙기면 좋은 부적 아이템 3장
 * - 이번 달에 피하면 좋은 아이템 3장
 * 을 결정적으로 뽑아 반환합니다.
 */
export function getMonthlyReading(date: Date = new Date()): MonthlyReading {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const seed = year * 100 + month;
  const rand = mulberry32(seed);

  const shuffled = shuffleWith(tarotCards, rand);

  // 앞쪽 절반은 carry 후보, 뒤쪽 절반은 avoid 후보로 분리해
  // 같은 카드가 양쪽에 절대 들어가지 않도록 함
  const half = Math.floor(shuffled.length / 2);
  const carryPool = shuffled.slice(0, half);
  const avoidPool = shuffled.slice(half);

  const usedItems = new Set<string>();
  const carryCards = pickUniqueByItem(carryPool, 3, usedItems);
  const avoidCards = pickUniqueByItem(avoidPool, 3, usedItems);

  const carry: MonthlyPick[] = carryCards.map((card) => ({
    card,
    orientation: "upright",
    item: card.fun.luckyItem,
    color: card.fun.luckyColor,
    emoji: card.fun.emoji,
    reason: card.upright.description,
  }));

  const avoid: MonthlyPick[] = avoidCards.map((card) => ({
    card,
    orientation: "reversed",
    item: card.fun.luckyItem,
    color: card.fun.luckyColor,
    emoji: card.fun.emoji,
    reason: card.reversed.warning,
  }));

  return {
    year,
    month,
    figureName: MONTHLY_FIGURES[month] ?? `${month}월의 인물`,
    totalPower: calcTotalPower([...carry, ...avoid]),
    carry,
    avoid,
    carryAdvice: carryAdviceFor(month),
    avoidAdvice: avoidAdviceFor(month),
  };
}

export function getCardById(id: number): TarotCard | undefined {
  return tarotCards.find((c) => c.id === id);
}
