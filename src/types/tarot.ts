export type TarotArcana = "major" | "minor";

export type TarotSuit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type TarotOrientation = "upright" | "reversed";

/**
 * 카드에 매칭되는 역사 속 인물.
 * 78장 매핑 작업은 별도 진행 예정이라 현재는 선택 필드입니다.
 */
export type HistoricalFigure = {
  name: string;
  era?: string;
  region?: string;
  summary?: string;
};

export type TarotCard = {
  id: number;
  arcana: TarotArcana;
  suit?: TarotSuit;
  number: number;

  name: string;
  nameKr: string;

  image: string;

  keywords: string[];
  shortMeaning: string;

  /** 이 카드를 대표하는 역사 속 인물 (선택) */
  figure?: HistoricalFigure;

  upright: {
    title: string;
    description: string;
    love: string;
    money: string;
    work: string;
    health: string;
  };

  reversed: {
    title: string;
    description: string;
    warning: string;
  };

  fun: {
    emoji: string;
    characterType: string;
    todayMessage: string;
    luckyItem: string;
    luckyColor: string;
  };
};

export type MonthlyPickKind = "carry" | "avoid";

export type MonthlyPick = {
  card: TarotCard;
  orientation: TarotOrientation;
  item: string;
  color: string;
  emoji: string;
  reason: string;
};

export type MonthlyReading = {
  year: number;
  month: number;
  totalPower: number;
  /** 이번 달의 분위기를 안내하는 역사 속 인물 이름 */
  figureName: string;
  carry: MonthlyPick[];
  avoid: MonthlyPick[];
  carryAdvice: string;
  avoidAdvice: string;
};
