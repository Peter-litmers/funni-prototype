import {
  Camera, User, Users, Heart, Baby, Briefcase, Dog, Cat, Dumbbell,
  Gift, Smile, Star, Flower2, Leaf, Sparkles, ImageIcon, Sun, Coffee,
  Cake, PawPrint, Tag,
  type LucideIcon,
} from "lucide-react";

export const ICON_OPTIONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: "camera", label: "카메라", Icon: Camera },
  { key: "user", label: "사람", Icon: User },
  { key: "users", label: "여러명", Icon: Users },
  { key: "heart", label: "하트", Icon: Heart },
  { key: "baby", label: "아기", Icon: Baby },
  { key: "briefcase", label: "서류가방", Icon: Briefcase },
  { key: "dog", label: "강아지", Icon: Dog },
  { key: "cat", label: "고양이", Icon: Cat },
  { key: "pawprint", label: "발자국", Icon: PawPrint },
  { key: "dumbbell", label: "덤벨", Icon: Dumbbell },
  { key: "gift", label: "선물", Icon: Gift },
  { key: "smile", label: "스마일", Icon: Smile },
  { key: "star", label: "별", Icon: Star },
  { key: "flower", label: "꽃", Icon: Flower2 },
  { key: "leaf", label: "잎", Icon: Leaf },
  { key: "sparkles", label: "반짝임", Icon: Sparkles },
  { key: "image", label: "이미지", Icon: ImageIcon },
  { key: "sun", label: "태양", Icon: Sun },
  { key: "coffee", label: "커피", Icon: Coffee },
  { key: "cake", label: "케이크", Icon: Cake },
];

export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map(o => [o.key, o.Icon]),
);

export const DEFAULT_CAT_ICON_KEY: Record<string, string> = {
  "프로필": "camera",
  "바디프로필": "dumbbell",
  "웨딩": "sparkles",
  "가족": "cake",
  "반려동물": "pawprint",
  "비즈니스": "briefcase",
  "커플": "heart",
  "아기": "baby",
};

export function getIconByKey(key: string | undefined): LucideIcon {
  if (!key) return Tag;
  return ICON_MAP[key] ?? Tag;
}

export function resolveCatIcon(
  categoryName: string,
  overrideMap: Record<string, string>,
): LucideIcon {
  const key = overrideMap[categoryName] ?? DEFAULT_CAT_ICON_KEY[categoryName] ?? "image";
  return getIconByKey(key);
}
