"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera, Home, LayoutGrid, User, Bell, Phone, MapPin, Star, Pencil, Check,
  CheckCircle2, ImageIcon, Calendar, Clock, Search, SlidersHorizontal, ChevronDown,
} from "lucide-react";
import { useCategories, useHomeKeywords, matchesKeyword, useAds, useRefundMatrix, pickRefundRate, REFUND_PERIOD_LABELS, useCategoryIcons, useNoShowReports, type HomeKeyword } from "../lib/admin-store";
import { resolveCatIcon } from "../lib/category-icons";

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/photopop-logo.png" alt="포토팟 로고" width={40} height={40} className="h-10 w-10 object-contain" />
      <p className="text-lg font-bold tracking-tight text-gray-900">포토팟</p>
    </div>
  );
}



const HOME_AD_PAGES = [
  [
    { title: "로맨틱 웨딩", subtitle: "대표 추천 노출", tone: "from-rose-100 to-pink-100" },
    { title: "프로필 촬영", subtitle: "인기 작가 큐레이션", tone: "from-pink-50 to-rose-100" },
    { title: "가족 촬영", subtitle: "주말 예약 인기", tone: "from-orange-50 to-rose-100" },
  ],
  [
    { title: "커플 촬영", subtitle: "야외 스냅 추천", tone: "from-fuchsia-50 to-pink-100" },
    { title: "아기 촬영", subtitle: "성장 기록 남기기", tone: "from-rose-50 to-orange-100" },
    { title: "바디프로필", subtitle: "성수 인기 스튜디오", tone: "from-pink-100 to-rose-200" },
  ],
  [
    { title: "비즈니스 촬영", subtitle: "브랜드/팀 프로필 추천", tone: "from-rose-50 to-pink-100" },
    { title: "반려동물 촬영", subtitle: "반려 가족과 함께", tone: "from-neutral-100 to-stone-100" },
    { title: "가족 패키지", subtitle: "3인 이상 촬영 추천", tone: "from-pink-50 to-amber-50" },
  ],
];


// 카테고리별 포트폴리오 (REQ-106: 탐색 경로의 카테고리에 맞는 사진만 표시)
type StudioCategoryPortfolio = Record<string, number[]>;

const STUDIOS: {
  id: number; name: string; cat: string; tags: string[]; desc: string; area: string;
  price: number; rating: number; reviews: number; phone: string;
  createdAt: string; location: string;
  portfolios: StudioCategoryPortfolio;
  vatIncluded: boolean;
  travelAvailable: boolean;
  paymentCount: number;
  distanceKm: number;
  intro?: string;
}[] = [
  { id: 1, name: "루미에르 스튜디오", cat: "프로필", tags: ["증명사진", "취업프로필", "이력서"], desc: "프로필촬영, 임직원 프로필, 이력서사진", area: "서울 강남구", price: 50000, rating: 4.8, reviews: 124, phone: "02-1234-5678", createdAt: "2026-04-10", location: "서울특별시 강남구 역삼동 123-4",
    portfolios: { "프로필": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 302, distanceKm: 1.2,
    intro: `✨ 루미에르 스튜디오 — 자연광이 가장 따뜻한 시간
'루미에르(Lumière)'는 프랑스어로 '빛'을 뜻합니다. 과장된 보정이 아닌, 자연광 속에서 가장 편안한 당신의 얼굴을 기록하는 강남 역삼 프로필 전문 스튜디오입니다.

👤 작가 소개
12년 경력의 이현우 실장과 7년 경력의 김지혜 팀장이 함께합니다. 2014년 오픈 이후 누적 10,000명 이상의 프로필을 촬영했으며, 삼성·LG·현대·카카오 등 대기업 임직원 프로필부터 취업·이직 준비생, SNS·배우 프로필까지 다양한 현장을 담아왔습니다.

🎯 저희가 추구하는 톤
과한 보정을 지양합니다. 얼굴형을 억지로 좁히거나 피부를 인형처럼 매끈하게 만들지 않아요. 원본이 가진 자연스러운 결을 살리고, 5년 뒤에 봐도 어색하지 않은 프로필을 만드는 것이 목표입니다. 실제 고객 리뷰의 80% 이상이 '자연스러워서 좋다'는 피드백입니다.

📋 촬영 프로세스
1) 예약 — 포토팟 앱에서 원하시는 날짜·시간 선택
2) 사전 상담 — 촬영 1~2일 전 카톡으로 복장·컨셉 무료 상담
3) 도착 & 준비 — 전용 탈의실·파우더룸 이용 (평균 10~15분)
4) 촬영 — 1컨셉 기준 30분, 200~300컷 테스트 후 선별
5) 현장 셀렉 — 마음에 드는 컷 즉시 선택 (약 15분)
6) 보정 — 1주일 이내 이메일로 원본 파일 전달
7) 재수정 — 최종 보정본 확인 후 1회 무료 재수정

🏢 시설·장비
• 면적: 25평 (메인 촬영 세트 3구역 + 탈의실 + 파우더룸)
• 카메라: Canon EOS R5 (풀프레임 4,500만 화소)
• 렌즈: 35mm·50mm·85mm 단렌즈 3종
• 조명: Profoto B10 × 4기 (자연광 미러링 세팅)
• 배경지: 화이트·그레이·베이지·블랙 4색
• 제공 소품: 블레이저, 화이트 셔츠, 넥타이, 무테 안경 (대여)

💼 패키지 상세
🎯 1컨셉 (기본) · ₩270,000
촬영 30분 / 보정본 4컷 / 단일 배경·단일 의상
→ 임직원·이력서·SNS 기본 프로필에 적합

🎯 2컨셉 (가장 인기) · ₩420,000
촬영 60분 / 보정본 7컷 / 배경 2색 + 의상 2벌
→ 취업·이직 준비생, 브랜드 SNS 런칭용

🎯 3컨셉 (프리미엄) · ₩580,000
촬영 90분 / 보정본 12컷 / 배경 3색 + 의상 3벌 + 헤어 스타일링 타임
→ 배우·모델·인플루언서 프로필용

➕ 추가 옵션
• 원본 JPG 전체 제공: +₩40,000
• 보정 컷 추가: +₩40,000 / 컷
• 헤어메이크업 (제휴샵): +₩70,000 세트

📌 이용 안내
🚇 강남역 2번 출구 도보 5분, 역삼역 3번 출구 도보 7분
🚗 건물 지하주차장 1시간 무료 (초과 시 10분 ₩1,000)
👕 복장: 과도한 로고·무늬 지양. 면·린넨 소재 권장. 여벌 2벌 이상 지참
⏰ 지각 시 남은 시간 내에서 진행 (추가 시간 ₩50,000 / 30분)
📸 보호자 1명 동반 가능. 반려동물·영유아 동반 불가

❓ 자주 묻는 질문
Q. 원본 파일 받을 수 있나요?
A. RAW는 제공 안 하고, 선별 전 JPG 원본은 +₩40,000 옵션입니다.

Q. 당일 예약 가능한가요?
A. 공실 발생 시 당일 가능 (포토팟 앱에서 실시간 확인). 최소 24시간 전 예약 권장.

Q. 보정 스타일 지정 되나요?
A. 사전 상담 시 레퍼런스 3~5장 전달해 주시면 최대한 반영합니다.

Q. 혼자 가도 되나요?
A. 혼자 오시는 분이 70%입니다. 편하게 오세요.

🎁 이번 달 이벤트
• 리뷰 작성 시 다음 촬영 ₩20,000 할인 쿠폰
• 친구 추천 시 양측 각 ₩10,000 적립

📍 오시는 길
서울특별시 강남구 역삼동 123-4 루미에르빌딩 3층
📞 카카오톡 @루미에르스튜디오 / 02-1234-5678
🕐 평일 10:00~21:00 / 주말 11:00~20:00 / 매주 월요일 휴무` },
  { id: 13, name: "루미에르 비즈컷", cat: "비즈니스", tags: ["사내프로필", "대표프로필", "단체촬영"], desc: "임직원·대표 프로필 전용, 팀 촬영 공간 별도", area: "서울 강남구", price: 60000, rating: 4.7, reviews: 38, phone: "02-1234-5678", createdAt: "2026-04-15", location: "서울특별시 강남구 역삼동 123-4 별관",
    portfolios: { "비즈니스": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 48, distanceKm: 1.2 },
  { id: 2, name: "선셋 포토랩", cat: "바디프로필", tags: ["일반바디", "피트니스", "커플바디"], desc: "바디프로필, 운동기록, 피트니스 브랜딩", area: "서울 성수동", price: 80000, rating: 4.9, reviews: 89, phone: "02-2345-6789", createdAt: "2026-03-28", location: "서울특별시 성동구 성수동 45-6",
    portfolios: { "바디프로필": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: false, paymentCount: 287, distanceKm: 3.8,
    intro: `🔥 선셋 포토랩 — 성수동에서 가장 단단한 바디프로필
크로스핏·헬스·필라테스 종사자들 사이에서 입소문 난 성수동 바디프로필 전문 스튜디오입니다. 3년간 단 한 번도 바디 컨텐츠 이외의 촬영을 받은 적 없습니다.

👤 작가 소개
작가 김민수 (前 보디빌딩 경기 사진작가 / 8년 경력). 피트니스 잡지 〈머슬앤피트니스〉 〈맥스Q〉 전속 촬영 이력. 선수 200명 이상의 대회 포트폴리오를 제작했습니다. 카메라 뒤에서 근육 라인이 어떻게 빛을 받아야 가장 단단해 보이는지 본능적으로 알고 있는 작가입니다.

🎯 저희만의 강점
① 펌핑 대응 — 촬영 중 간단 덤벨/밴드 세팅 가능 (혈관·어깨 펌핑 타이밍 맞춤)
② 역광·측광 세팅 전문 — 복근·등·어깨 라인 강조 라이팅 30가지 프리셋
③ 커플바디 특화 — 커플 포즈 가이드 보드 50개 준비
④ 당일 보정 가능 — 추가 옵션 선택 시 촬영 후 6시간 이내 완성

📋 촬영 프로세스
1) 예약 후 1주일 컨디션 관리 가이드 발송 (식단·수분·탄수화물 로딩)
2) 촬영 당일 도착 → 펌핑 운동실 10분 이용
3) 오일 바디 세팅 (선택)
4) 촬영 — 60분 기준 400컷 이상
5) 현장 셀렉 후 24시간~1주일 내 보정본 전달

🏢 시설·장비
• 면적: 20평 (메인 스튜디오 + 펌핑 운동실 + 샤워실 1구)
• 펌핑 장비: 덤벨 5~20kg, 저항밴드, 풀업바
• 카메라: Sony A7R V (풀프레임 6,100만 화소)
• 렌즈: 24-70mm, 70-200mm 줌렌즈 2종
• 조명: Godox AD600 × 6기 (측광/역광/키라이트)
• 오일·선탠: 오일 2종·선탠 스프레이 비치

💼 패키지 상세
💪 1컨셉 — ₩260,000
촬영 45분 / 보정본 5컷 / 기본 라이팅
→ 첫 바디프로필, 기록용

💪 2컨셉 (인기) — ₩410,000
촬영 75분 / 보정본 10컷 / 역광·측광 포함
→ 대회 프리·포스트, 트레이너 포트폴리오용

💪 커플 바디 — ₩520,000
촬영 90분 / 보정본 14컷 / 커플 포즈 가이드 포함
→ 커플 바디프로필, 기념일 선물용

➕ 추가 옵션
• 오일 풀세팅 (도우미 포함): +₩30,000
• 당일 보정 (6시간 이내): +₩50,000
• 영상 기록 (숏폼 3~5초): +₩60,000

📌 이용 안내
🚇 뚝섬역 8번 출구 도보 7분, 성수역 3번 출구 도보 10분
🚗 인접 공영주차장 (시간당 ₩1,500)
👕 복장: 촬영 의상(수영복·바디슈트·속옷) 3벌 이상 지참 권장
💧 수분: 촬영 전 12시간 수분 제한 정보 사전 발송
🚫 반려동물 동반 불가, 영유아 동반 불가

❓ FAQ
Q. 헬스 경험 없어도 가능한가요?
A. 기록용으로 찍으시는 분도 많습니다. 부담 없이 오세요.

Q. 생리 중 촬영 가능한가요?
A. 가능합니다. 다만 컨디션 고려해 일정 변경도 자유롭게 도와드립니다.

Q. 셀카 참고 사진 많이 가져가도 되나요?
A. 오히려 권장합니다. 원하는 포즈 10장 이상 가져와 주세요.

Q. 남녀 작가 선택 가능한가요?
A. 현재는 남성 작가 1명 운영. 여성 작가는 2026년 6월부터 합류 예정.

🎁 이번 달 이벤트
• 대회 1개월 전 촬영 시 대회 당일 현장 촬영 10% 할인
• 트레이너 추천 시 본인 + 회원 모두 15% 할인 (평생)

📍 오시는 길
서울특별시 성동구 성수동 45-6 SE타워 B1
📞 02-2345-6789 / 인스타 @sunset_photolab
🕐 화~토 12:00~22:00 / 일요일 10:00~18:00 / 월요일 휴무` },
  { id: 3, name: "블룸 웨딩 스튜디오", cat: "웨딩", tags: ["본식스냅", "야외웨딩", "리마인드"], desc: "웨딩스냅, 본식촬영, 야외웨딩", area: "서울 잠실", price: 200000, rating: 4.7, reviews: 56, phone: "02-3456-7890", createdAt: "2026-04-05", location: "서울특별시 송파구 잠실동 78-9",
    portfolios: { "웨딩": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 190, distanceKm: 6.1,
    intro: `💐 블룸 웨딩 스튜디오 — 20년 웨딩 전문
"인생에서 가장 빛나는 하루"를 기록하는 잠실 웨딩 전문 스튜디오입니다. 2004년 오픈 이후 3,000커플 이상의 본식·리마인드·프리웨딩을 담았습니다.

👤 작가팀 소개
수석 작가 박성준 (20년 경력) + 스태프 사진 7명 / 영상팀 4명. 웨딩 매거진 〈마이웨딩〉 〈더페스트〉 정기 기고 작가. 코엑스·신라·롯데 호텔 본식 촬영 전문. 매년 100개 이상의 웨딩홀을 출장 촬영합니다.

🎯 촬영 영역
① 본식 스냅 — 예식장 출장, 신부 입장부터 폐백까지 전 과정
② 야외 웨딩 — 남산·서울숲·경복궁·한강공원·제주 로케이션
③ 리마인드 웨딩 — 결혼 5/10주년, 40대+ 커플 대상
④ 셀프 웨딩 — 스튜디오 내 간소 촬영 (드레스 대여 포함)
⑤ 프리웨딩 — 본식 전 사전 촬영, 청첩장·메인 액자용

📋 촬영 프로세스 (본식 기준)
1) 상담 (예식 2개월 전) — 예식장 답사·동선 확인·촬영 컨셉 확정
2) 리허설 촬영 (예식 1개월 전) — 선택 옵션 / 헤어·메이크업 확인
3) 본식 당일 — 메이크업실부터 폐백실까지 전 구간 (평균 7시간)
4) 1차 셀렉 (1주일 이내) — 500~700컷 선별본 전달
5) 보정 (2~3주) — 고객 최종 셀렉 후 보정 300컷 전달
6) 앨범 제작 (4~5주) — 종이앨범·디지털앨범 선택
7) 액자·영상 납품

🏢 시설·장비
• 스튜디오 내부: 150평 (메인 세트 5개 + 드레스룸 + 메이크업실 2)
• 드레스 보유: 메인 40벌, 리마인드 20벌, 한복 15벌
• 카메라: Canon R5 × 3기 + Sony A7R IV × 2기 (백업 동시 촬영)
• 조명: 스피드라이트·스튜디오 조명 세트 풀 보유
• 야외 장비: 지미집, 드론 (DJI Mavic 3 Pro)

💼 패키지 상세 (본식)
💕 베이직 — ₩1,800,000
메인 1명 / 보정 300컷 / 디지털 앨범 / 예식장 1곳
→ 소규모 예식장 (하우스·호텔 작은 홀)

💕 스탠다드 (가장 인기) — ₩2,600,000
메인 1명 + 스냅 1명 / 보정 500컷 / 디지털 + 종이앨범 / 지미집 포함
→ 평균 규모 예식장 (호텔·컨벤션)

💕 프리미엄 — ₩3,900,000
메인 + 스냅 2명 + 영상팀 / 보정 700컷 / 앨범 풀패키지 / 드론 + 지미집
→ 대규모 예식장, 하이라이트 영상 포함

💕 리마인드 웨딩 — ₩800,000
스튜디오 3시간 / 드레스 1벌 / 보정 40컷
→ 40대+ 커플 대상, 가족 동반 가능

💕 셀프 웨딩 — ₩550,000
스튜디오 2시간 / 드레스 1벌 / 보정 25컷
→ 간소 결혼·사진 기록만 원하는 분께

📌 이용 안내
🚇 잠실역 11번 출구 도보 8분
🚗 건물 전용주차장 2시간 무료 (웨딩 고객)
👗 드레스 픽업: 스튜디오 사전 방문 시 전용 상담실 예약
⏰ 본식 촬영은 예식 6개월 전부터 예약 필수
✈️ 제주·발리·다낭 해외 로케이션 출장 가능 (별도 견적)

❓ FAQ
Q. 본식 당일 영상까지 맡길 수 있나요?
A. 프리미엄 패키지는 영상팀 포함. 기타 패키지도 영상 옵션 추가 가능.

Q. 예식장 제휴가 있나요?
A. 시그니엘·그랜드하얏트·더채플앳청담 등 15곳 제휴 중 (제휴가 할인 10%).

Q. 해외 촬영도 되나요?
A. 제주·발리·다낭 기본 출장. 항공·숙박 고객 부담, 작가료는 일급 ₩400,000.

Q. 드레스 별도 구매 가능한가요?
A. 스튜디오 제휴 브랜드 기준 20% 할인 제휴.

🎁 이번 달 이벤트
• 리마인드 웨딩: 2026년 5~6월 평일 예약 시 20% 할인
• 본식 + 리마인드 동시 예약 시 본식 10% 할인

📍 오시는 길
서울특별시 송파구 잠실동 78-9 블룸타워 2F~3F
📞 02-3456-7890 / 카카오톡 @블룸웨딩
🕐 화~일 11:00~20:00 / 월요일 휴무` },
  { id: 4, name: "패밀리 모먼츠", cat: "가족", tags: ["3대가족", "가족나들이", "돌잔치"], desc: "가족사진, 3대 가족 스냅, 주말 촬영", area: "경기 일산", price: 130000, rating: 4.5, reviews: 31, phone: "031-9234-5678", createdAt: "2026-04-06", location: "경기도 고양시 일산동구 장항동 101-9",
    portfolios: { "가족": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 57, distanceKm: 23.1,
    intro: `🌿 패밀리 모먼츠 — 온 가족이 편안한 주말 스튜디오
일산 호수공원 근처, 3대 가족 사진을 가장 많이 찍는 스튜디오입니다. 어르신이 계단을 오르지 않도록 1층에 위치했고, 주말만 운영해 평일 직장인 가족도 부담 없이 방문할 수 있어요.

👤 작가 소개
부부 작가 이경훈·조은지가 함께 운영합니다. 이경훈 작가는 아동복 브랜드 컷 10년, 조은지 작가는 육아 매거진 출신. 두 분 다 아이를 키우는 부모라서 아이가 울거나 낯설어할 때 어떻게 달래야 할지 잘 알고 있어요.

🎯 저희가 잘 하는 것
① 3대 가족 (조부모+부모+자녀) — 대형 단체 촬영 전문
② 돌잔치·생일 — 세트 + 케이크 스타일링 포함
③ 가족 나들이 — 근처 호수공원 출장 가능
④ 반려동물 동반 가능 — 소형견 환영

📋 촬영 프로세스
1) 예약 — 주말만 운영 (토·일·공휴일)
2) 사전 안내 — 1주일 전 복장·소품 가이드 발송
3) 현장 도착 — 어르신은 1층 입구 바로 앞 하차 가능
4) 아이 적응 타임 (10~15분) — 간식·장난감 준비
5) 촬영 (60~90분) — 그룹 컷 → 세부 컷 → 캔디드 순서
6) 현장 셀렉 — 모든 가족이 함께 선택
7) 보정 — 2주 이내 USB·웹 링크 전달

🏢 시설·장비
• 면적: 40평 (메인 세트 3개 + 포토존 + 유아 놀이방 + 장애인 화장실)
• 스튜디오 배경: 내추럴 우드, 화이트, 한지 3종
• 특수 세트: 돌잔치용 컬러 풍선·케이크 테이블
• 카메라: Canon R6 mark II, 단렌즈 3종
• 유아 장비: 아기띠·기저귀 교환대·수유실

💼 패키지 상세
👨‍👩‍👧 가족 기본 — ₩350,000
촬영 60분 / 보정 15컷 / 3~5명 기준 / 일반 가족사진·명절 기록

👨‍👩‍👧 3대 가족 (인기) — ₩520,000
촬영 90분 / 보정 25컷 / 6~10명 / 단체 + 소그룹 구성 / 환갑·칠순·명절 대가족

🎂 돌잔치 기본 — ₩450,000
촬영 75분 / 보정 20컷 / 케이크·풍선 세팅 / 100일·돌·생일 파티

🎂 돌잔치 프리미엄 — ₩680,000
촬영 120분 / 보정 35컷 / 3컨셉 / 가족 그룹컷 + 아이 독사진

➕ 추가 옵션
• 헤어메이크업 출장 (2인): +₩100,000
• 호수공원 출장: +₩150,000 (이동 + 1시간)
• 영상 스케치 3~5분: +₩200,000

📌 이용 안내
🚇 정발산역 2번 출구 도보 12분, 주엽역 3번 출구 도보 15분
🚗 건물 전용주차장 2시간 무료 (대형차 OK)
👗 가족 드레스코드 컨설팅 무료 (카톡 상담)
♿ 휠체어 접근 가능, 1층 구성, 턱 없음
🐶 소형·중형견 동반 가능 (대형견 사전 협의)

❓ FAQ
Q. 아이가 울면 어떻게 하나요?
A. 여유 시간으로 잡혀있어요. 쉬는 타임 넣으며 진행합니다.

Q. 할머니가 거동이 불편하신데 가능한가요?
A. 1층 매장·계단 없이 진입. 의자 촬영 구도도 많이 준비됩니다.

Q. 돌잔치 당일 현장 촬영도 되나요?
A. 일산 권역 출장 가능. 3시간 ₩600,000 기본.

🎁 이번 달 이벤트
• 5월 어버이날 주간: 3대 가족 15% 할인
• 둘째·셋째 동반 시 1인당 ₩30,000 할인

📍 오시는 길
경기도 고양시 일산동구 장항동 101-9 1층
📞 031-9234-5678 / 카카오톡 @패밀리모먼츠
🕐 토·일·공휴일 10:00~18:00 / 평일 예약 문의 협의` },
  { id: 5, name: "펫모먼츠 스튜디오", cat: "반려동물", tags: ["강아지", "고양이", "반려가족"], desc: "반려동물 촬영, 반려 가족 스냅, 맞춤 소품 제공", area: "서울 망원동", price: 90000, rating: 4.7, reviews: 44, phone: "02-4567-8901", createdAt: "2026-04-12", location: "서울특별시 마포구 망원동 45-6",
    portfolios: { "반려동물": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: true, paymentCount: 154, distanceKm: 8.4,
    intro: `🐾 펫모먼츠 스튜디오 — 망원동 반려동물 전문
강아지 800마리, 고양이 300마리, 토끼·앵무새·햄스터 등 특수동물까지 연 1,200마리 이상의 반려 가족을 촬영해온 망원동 펫 전문 스튜디오입니다.

👤 작가 & 펫시터
이효진 대표 (반려동물행동교정사 자격 보유 / 수의대 중퇴 후 전업). 스튜디오에 상주 펫시터 2명이 함께 있어, 촬영 전후 반려동물의 컨디션을 세심하게 관리합니다.

🎯 저희만의 강점
① 펫 전용 위생 관리 — 모든 세트 매 촬영 후 소독 (동물전용 소독제)
② 짖음·공격 대응 — 훈련사 자격 작가가 직접 핸들링
③ 특수동물 환영 — 파충류·조류·설치류 모두 촬영 가능
④ 반려 가족 케어 — 사람+동물 그룹샷 노하우 3년 축적

📋 촬영 프로세스
1) 사전 설문 — 반려동물 성격·간식 선호·특이사항
2) 도착 적응 타임 (15분) — 스튜디오 탐색·간식 제공
3) 테스트컷 몇 장으로 경계심 풀기
4) 본 촬영 (30~60분) — 컨디션 기준으로 중간 쉬는 타임
5) 현장 셀렉 또는 1주일 이내 온라인 셀렉

🏢 시설·장비
• 면적: 18평 (촬영존 + 놀이존 + 대기실 + 급수·급식 공간)
• 배경: 화이트·우드·그린·핑크 4색
• 특수 소품: 리본·왕관·생일 모자·케이크 모형 50종
• 카메라: Sony A7 IV + 85mm f/1.4 (움직이는 피사체 대응)
• 조명: 무소음 LED (플래시 공포 있는 아이 배려)

💼 패키지 상세
🐶 기본 반려 — ₩280,000
촬영 45분 / 보정 12컷 / 1마리 기준 / 소품 3종 포함

🐶 반려 가족 (인기) — ₩390,000
촬영 75분 / 보정 20컷 / 반려동물 + 보호자 / 가족 그룹샷 + 개별샷

🐶 멀티 펫 — ₩440,000
촬영 90분 / 보정 25컷 / 2마리 이상 / 다묘·다견 가정

🐶 돌/생일 — ₩340,000
촬영 60분 / 보정 15컷 / 케이크·풍선 데코 / 기념일 기록

➕ 추가 옵션
• 출장 촬영 (집 · 카페 · 공원): +₩150,000 (서울 내, 1시간)
• 영상 숏폼 (15~30초): +₩100,000
• 유화 액자 (A3): +₩180,000

📌 이용 안내
🚇 망원역 2번 출구 도보 5분
🚗 공영주차장 (1일 최대 ₩8,000)
💉 예방 접종 확인서 지참 권장 (필수 아님)
🍖 간식 지참 필수 (스트레스 완화용)
🦴 다른 반려동물과 겹치지 않게 시간 간격 20분 유지

❓ FAQ
Q. 짖는 아이 촬영 가능해요?
A. 훈련사 경험 있는 작가라 대부분 괜찮습니다. 심한 경우 간식·쉬는 타임 적극 활용.

Q. 사람 없이 반려동물만 촬영 가능해요?
A. 네, 기본 반려 패키지가 이 경우입니다.

Q. 고양이 촬영 어려움 많은데 가능한가요?
A. 케이지·이동장 그대로 와서 천천히 꺼내 진행합니다. 실패 케이스 적습니다.

Q. 대형견도 되나요?
A. 대형견 (리트리버·말라뮤트 등) 환영. 촬영장 넓게 운영.

🎁 이번 달 이벤트
• 2마리 이상 촬영 시 2번째 마리부터 ₩30,000 할인
• 반려동물 생일 주간: 돌/생일 패키지 15% 할인

📍 오시는 길
서울특별시 마포구 망원동 45-6 1층
📞 02-4567-8901 / 카카오톡 @펫모먼츠
🕐 화~일 11:00~20:00 / 월요일 휴무` },
  { id: 6, name: "브랜드컷 스튜디오", cat: "비즈니스", tags: ["단체촬영", "음식", "제품"], desc: "브랜드 프로필, 팀 촬영, 음식·제품 촬영", area: "서울 합정", price: 60000, rating: 4.7, reviews: 45, phone: "02-5678-9012", createdAt: "2026-04-08", location: "서울특별시 마포구 합정동 78-9",
    portfolios: { "비즈니스": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 118, distanceKm: 7.9,
    intro: `📐 브랜드컷 스튜디오 — B2B 전용 비즈니스 촬영
스타트업·F&B 브랜드·로컬 셀러의 촬영 파트너. 합정 홍대입구 2분 거리에 위치한 비즈니스 전문 스튜디오입니다. 월 평균 40개 이상의 브랜드·팀 촬영을 진행합니다.

👤 작가 & 디렉터
김태웅 대표 (前 삼성전자 홍보실 출신 커머셜 작가 / 15년 경력). 아트디렉터 배유진이 브랜드 컨셉 제안·촬영 리딩을 함께 담당합니다.

🎯 우리가 잘 하는 것
① 대표·임원 프로필 — 연차보고서·IR 자료·보도자료용
② 팀 단체 촬영 — 10~50명 규모의 사내 프로필 일괄
③ 음식 촬영 — 메뉴판·배달앱 썸네일·SNS 컨텐츠
④ 제품 촬영 — 커머스·크라우드펀딩·오픈마켓 상세페이지
⑤ 당일 납품 — 옵션 추가 시 촬영 후 4시간 내 보정본 전달 (배달앱 긴급 대응)

📋 촬영 프로세스
1) 브랜드 인터뷰 (30분) — 용도·톤·사용처·레퍼런스
2) 촬영 기획안 작성 — 컷 리스트·조명 플랜 사전 공유
3) 촬영 당일 — 시안 확인 → 촬영 → 중간 프리뷰
4) 셀렉 & 보정 — 고객 피드백 1회 반영
5) 납품 — 클라우드 링크 + 고해상도 원본

🏢 시설·장비
• 면적: 60평 (메인 스튜디오 A 25평 + B 15평 + 제품 부스 + 음식 부스)
• 음식 촬영 전용 — 키친 셋업 (가스레인지·인덕션·싱크대)
• 제품 라이팅 — 무광·반사·그림자 컨트롤 풀세트
• 카메라: Canon R5 + Phase One IQ4 (제품 고해상 전용)
• 렌즈: 24-105mm, 70-200mm, 100mm 매크로 3종

💼 패키지 상세
👔 개인 대표프로필 — ₩280,000
촬영 60분 / 보정 8컷 / 배경 2색 / 스튜디오 내 의상 대여

👔 팀 단체 (인기) — ₩490,000 (기본) + 인당 ₩25,000
촬영 120분 / 보정 인당 2컷 / 단체샷 5컷 / 10명 기준 ₩740,000

🍜 음식 촬영 — ₩350,000
촬영 90분 / 보정 10컷 / 접시 10~15종 / 배달앱·SNS 최적 사이즈

📦 제품 촬영 기본 — ₩420,000
촬영 120분 / 보정 15컷 / 제품 5종 / 커머스 상세 페이지용

📦 제품 촬영 프리미엄 — ₩680,000
촬영 180분 / 보정 25컷 / 제품 10종 / 라이프스타일 컷 포함

➕ 추가 옵션
• 당일 납품 (4시간 이내): +₩150,000
• 모델 섭외 (인물): +₩200,000/인
• 3D 360도 제품 회전: +₩300,000/제품
• 레퍼런스 벤치마킹 보고서: +₩100,000

📌 이용 안내
🚇 합정역 2번 출구 도보 6분, 홍대입구역 8번 출구 도보 10분
🚗 건물 지하주차 4시간 무료 (촬영 고객)
📧 최종 납품은 Dropbox·Google Drive 링크 제공
🧾 세금계산서 발행 가능 (당일)
🕐 야간 촬영 (22:00 이후): +₩100,000/시간

❓ FAQ
Q. 견적 문의 전에 답사 가능한가요?
A. 가능합니다. 사전 예약 시 담당 디렉터가 공간 투어.

Q. 배경 합성·누끼 따기도 되나요?
A. 기본 포함. 복잡한 합성은 옵션 (+₩30,000/컷).

Q. 음식은 음식점에서 가져와도 되나요?
A. 조리된 음식을 가져오셔도 좋고, 키친에서 즉석 촬영 세팅도 가능.

Q. 계약서 필수인가요?
A. 기업 고객은 표준 계약서 작성. 개인 사업자는 카톡 견적 확인서로 대체 가능.

🎁 이번 달 이벤트
• 팀 단체 10인 이상 예약 시 인당 ₩5,000 할인
• 첫 거래 브랜드: 제품 촬영 20% 할인

📍 오시는 길
서울특별시 마포구 합정동 78-9 브랜드컷타워 3~4F
📞 02-5678-9012 / 이메일 hello@brandcut.kr
🕐 월~금 09:00~19:00 / 토 10:00~18:00 / 일요일 휴무` },
  { id: 7, name: "베이비데이 스튜디오", cat: "아기", tags: ["신생아", "100일", "돌"], desc: "신생아·100일·돌 촬영, 성장 스냅", area: "서울 신촌", price: 70000, rating: 4.6, reviews: 28, phone: "02-6789-0123", createdAt: "2026-04-14", location: "서울특별시 서대문구 신촌동 21-3",
    portfolios: { "아기": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 84, distanceKm: 5.1,
    intro: `👶 베이비데이 스튜디오 — 아기를 위한 가장 안전한 스튜디오
신생아·50일·100일·200일·돌까지, 아기의 첫 1년을 기록하는 신촌 아기 전문 스튜디오입니다. 연 800건 이상 촬영하며 아기 촬영에만 집중하고 있어요.

👤 작가 소개
강주연 대표 (신생아 사진 자격증 NAPCP 보유 / 9년 경력). 산후조리원 출강 경력 3곳. 아기 행동 패턴을 이해하는 베이비 시터 2명이 상주해 촬영 내내 함께합니다.

🎯 아기 촬영의 차별점
① 위생 — 매 촬영 후 세트 전면 소독 (병원급 소독제)
② 온도 관리 — 실내 25℃ 유지 + 난방 패드·담요 준비
③ 수면 대응 — 신생아 촬영은 재웠다 깨는 사이클에 맞춤
④ 가족 대기 공간 — 편안한 소파·수유실·기저귀 교환대
⑤ 돌잔치 연계 — 당일 현장 출장 + 영상 스케치 세트 할인

📋 촬영 프로세스 (신생아 기준)
1) 사전 연락 (출산 예정일 전후) — 촬영 가능 일정 미리 확정
2) 출생 후 14일 이내 도착 추천 — 자는 시간 多
3) 스튜디오 도착 후 수유·트림 (보호자 케어 타임)
4) 촬영 — 60~120분, 중간 수유 타임 포함
5) 현장 프리뷰 — 부모님 취향 반영
6) 보정 — 10일 이내 USB 전달

🏢 시설·장비
• 면적: 22평 (메인 세트 + 소형 세트 + 가족 대기실 + 수유실 + 파우더룸)
• 세트: 화이트·파스텔·한지·우드 4종
• 아기 안전 소품: 쿠션·바구니·천·헤어밴드 (모두 무독성 인증)
• 카메라: Sony A7 IV + 50mm 단렌즈 (무소음 모드)
• 조명: 플래시 없음, 지속광 LED만 사용 (아기 눈 보호)

💼 패키지 상세
👶 신생아 (0~1개월) — ₩380,000
촬영 120분 / 보정 15컷 / 세트 2컨셉 / 부모 동반 그룹샷 3컷

👶 50일·100일 — ₩320,000
촬영 90분 / 보정 12컷 / 세트 2컨셉 / 부모 그룹샷 2컷

🎂 돌 기본 — ₩450,000
촬영 120분 / 보정 20컷 / 세트 3컨셉 / 가족 그룹샷 5컷

🎂 돌 프리미엄 (인기) — ₩620,000
촬영 180분 / 보정 30컷 / 세트 4컨셉 + 돌복 대여 / 현장 영상 스케치 포함

📸 성장 기록 (월별) — ₩180,000/회 × 12
매월 방문 1년 패키지 / 매회 보정 8컷 / 첫돌 앨범 증정

➕ 추가 옵션
• 만삭 촬영 (임신 8~9개월): ₩280,000 (패키지 결합 시 20% 할인)
• 돌잔치 현장 출장 (2시간): +₩350,000
• 가족 동반 추가 인원 (3명 이상): +₩30,000/인
• USB 앨범 (종이 액자 포함): +₩120,000

📌 이용 안내
🚇 신촌역 2번 출구 도보 8분
🚗 건물 지하주차 2시간 무료
🌡️ 실내 25℃ 유지, 쌀쌀한 계절에도 아기 맨몸 촬영 가능
🤱 수유실 별도 (완모·혼합수유 모두 편하게)
💉 예방 접종 직후 (24~48시간) 촬영은 권장하지 않음
🧦 신생아는 옷 없이 쿠션·천 세팅이 기본

❓ FAQ
Q. 아기가 촬영 내내 우는데 괜찮을까요?
A. 70% 이상 아기가 한 번 이상 웁니다. 여유 시간으로 재촬영 기본 포함.

Q. 부모도 같이 찍을 수 있나요?
A. 모든 패키지에 부모·가족 동반 그룹샷이 기본 포함되어 있어요.

Q. 몇 달 아기까지 가능한가요?
A. 신생아~만 3세까지. 4세 이상은 패밀리 모먼츠 추천드려요.

Q. 쌍둥이·삼둥이도 되나요?
A. 가능합니다. 2인 이상은 +₩80,000/인 추가.

🎁 이번 달 이벤트
• 첫 돌 맞이 5월 프로모션: 돌 프리미엄 10% 할인
• 친구 추천 시 양측 ₩15,000 할인 쿠폰

📍 오시는 길
서울특별시 서대문구 신촌동 21-3 베이비타워 2F
📞 02-6789-0123 / 카카오톡 @베이비데이
🕐 화~일 10:00~19:00 / 월요일 휴무` },
  { id: 8, name: "아이덴티티 프로필", cat: "프로필", tags: ["취업프로필", "증명사진", "SNS프로필"], desc: "취업 프로필, 증명용 프로필, SNS 프로필", area: "서울 종로구", price: 30000, rating: 4.4, reviews: 52, phone: "02-7890-1234", createdAt: "2026-04-09", location: "서울특별시 종로구 관철동 14-7",
    portfolios: { "프로필": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: false, paymentCount: 111, distanceKm: 4.4 },
  { id: 9, name: "커플모먼트 스튜디오", cat: "커플", tags: ["기념일", "데이트스냅", "프리웨딩"], desc: "커플촬영, 기념일 스냅, 데이트 사진", area: "서울 연남동", price: 110000, rating: 4.8, reviews: 39, phone: "02-8901-2345", createdAt: "2026-04-03", location: "서울특별시 마포구 연남동 33-12",
    portfolios: { "커플": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 92, distanceKm: 9.1 },
  { id: 10, name: "프라이빗 웨딩하우스", cat: "웨딩", tags: ["셀프웨딩", "프리웨딩", "리마인드"], desc: "프라이빗 웨딩, 셀프웨딩, 리마인드 촬영", area: "서울 청담동", price: 260000, rating: 4.9, reviews: 21, phone: "02-9012-3456", createdAt: "2026-04-16", location: "서울특별시 강남구 청담동 55-1",
    portfolios: { "웨딩": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: true, paymentCount: 61, distanceKm: 2.8 },
  { id: 11, name: "바디에디션 랩", cat: "바디프로필", tags: ["피트니스", "선수", "개인바디"], desc: "바디 프로필, 운동기록 촬영, 피트니스 브랜딩", area: "서울 성신여대", price: 150000, rating: 4.8, reviews: 26, phone: "02-9345-6789", createdAt: "2026-04-13", location: "서울특별시 성북구 동선동 45-2",
    portfolios: { "바디프로필": [1,2,3,4,5,6] }, vatIncluded: false, travelAvailable: false, paymentCount: 73, distanceKm: 11.6 },
  { id: 12, name: "비즈니스 데이랩", cat: "비즈니스", tags: ["사내프로필", "단체촬영", "제품"], desc: "사내 프로필, 팀 스냅, 제품·단체 촬영", area: "서울 서초구", price: 95000, rating: 4.7, reviews: 18, phone: "02-9123-4567", createdAt: "2026-04-11", location: "서울특별시 서초구 서초동 88-4",
    portfolios: { "비즈니스": [1,2,3,4,5,6] }, vatIncluded: true, travelAvailable: true, paymentCount: 49, distanceKm: 7.3 },
];

const HAIR_MAKEUP_OPTIONS = [
  { id: 1, name: "헤어 메이크업", price: 30000 },
  { id: 2, name: "얼굴 메이크업", price: 50000 },
  { id: 3, name: "세트 (헤어+얼굴)", price: 70000 },
];

const PRICE_RANGES = [
  { key: "all", label: "전체", min: 0, max: Infinity },
  { key: "low", label: "5만원 이하", min: 0, max: 50000 },
  { key: "mid", label: "5~10만원", min: 50001, max: 100000 },
  { key: "high", label: "10~20만원", min: 100001, max: 200000 },
  { key: "premium", label: "20만원 이상", min: 200001, max: Infinity },
];

const BOOKED_TIMES = ["10:00", "11:00", "15:00"];

const CONSUMER_NOTIFICATIONS: { id: number; type: string; text: string; time: string; read: boolean; action?: { screen: Screen; tab?: Tab; reviewTarget?: string } }[] = [
  { id: 1, type: "booking", text: "루미에르 스튜디오 예약이 확정되었습니다", time: "10분 전", read: false, action: { screen: "myBookings", tab: "mypage" } },
  { id: 2, type: "remind", text: "내일 선셋 포토랩 촬영이 있습니다", time: "1시간 전", read: false, action: { screen: "myBookings", tab: "mypage" } },
  { id: 3, type: "review", text: "브랜드컷 스튜디오 촬영은 어떠셨나요? 리뷰를 남겨주세요", time: "3시간 전", read: true, action: { screen: "reviewWrite", tab: "mypage", reviewTarget: "브랜드컷 스튜디오" } },
  { id: 4, type: "booking", text: "블룸 웨딩 스튜디오 예약이 확정되었습니다", time: "1일 전", read: true, action: { screen: "myBookings", tab: "mypage" } },
  { id: 5, type: "system", text: "포토팟 앱이 업데이트되었습니다", time: "3일 전", read: true },
];

type UpcomingBooking = {
  studio: string;
  date: string;
  time: string;
  cat: string;
  price: string;
  status: string;
  cancelReason?: string;
};
const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  { studio: "루미에르 스튜디오", date: "2026.05.10 (토)", time: "14:00~16:00", cat: "프로필", price: "₩100,000", status: "확정" },
  { studio: "선셋 포토랩", date: "2026.05.18 (일)", time: "10:00~12:00", cat: "바디프로필", price: "₩160,000", status: "확정" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.05.25 (일)", time: "10:00~14:00", cat: "웨딩", price: "₩800,000", status: "대기" },
];
const COMPLETED_BOOKINGS = [
  { studio: "브랜드컷 스튜디오", date: "2026.04.20 (일)", time: "13:00~15:00", cat: "비즈니스", price: "₩80,000", status: "완료", canReview: true },
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.05 (토)", time: "10:00~14:00", cat: "웨딩", price: "₩800,000", status: "완료", canReview: false },
  { studio: "패밀리 모먼츠", date: "2026.03.22 (토)", time: "10:00~12:00", cat: "가족", price: "₩240,000", status: "완료", canReview: false },
];
const CANCELLED_BOOKINGS = [
  { studio: "펫모먼츠 스튜디오", date: "2026.04.15 (화)", time: "15:00~17:00", cat: "반려동물", price: "₩120,000", status: "취소됨", reason: "소비자 취소 · 촬영 1일 전 취소로 50% 환불" },
  { studio: "루미에르 스튜디오", date: "2026.03.28 (금)", time: "10:00~12:00", cat: "프로필", price: "₩100,000", status: "취소됨", reason: "업체 취소 · 100% 환불 처리" },
];
const MY_REVIEWS_DATA = [
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.06", rating: 5, text: "정말 만족스러운 촬영이었습니다. 결과물도 훌륭해요!" },
  { studio: "패밀리 모먼츠", date: "2026.03.23", rating: 4, text: "가족 모두 편안하게 촬영할 수 있었어요. 스태프가 친절합니다." },
  { studio: "브랜드컷 스튜디오", date: "2026.03.10", rating: 5, text: "팀 프로필 결과물이 기대 이상이에요. 재방문 예정입니다!" },
];
const PAYMENT_HISTORY = [
  { studio: "루미에르 스튜디오", date: "2026.05.08", amount: "₩100,000", method: "카드", status: "결제완료" },
  { studio: "선셋 포토랩", date: "2026.05.05", amount: "₩160,000", method: "카드", status: "결제완료" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.04.03", amount: "₩800,000", method: "카카오페이", status: "결제완료" },
  { studio: "브랜드컷 스튜디오", date: "2026.04.18", amount: "₩80,000", method: "카드", status: "결제완료" },
  { studio: "펫모먼츠 스튜디오", date: "2026.04.13", amount: "₩120,000", method: "카드", status: "환불완료" },
];
const ALL_MY_BOOKINGS_FOR_MYPAGE = [
  { studio: "루미에르 스튜디오", date: "2026.05.10 (토) 14:00~16:00", cat: "프로필 촬영", status: "확정" },
  { studio: "선셋 포토랩", date: "2026.05.18 (일) 10:00~12:00", cat: "바디프로필", status: "확정" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.05.25 (일) 10:00~14:00", cat: "웨딩", status: "대기" },
  { studio: "브랜드컷 스튜디오", date: "2026.04.20 (일) 13:00~15:00", cat: "비즈니스", status: "완료" },
  { studio: "패밀리 모먼츠", date: "2026.04.12 (토) 10:00~12:00", cat: "가족", status: "완료" },
  { studio: "펫모먼츠 스튜디오", date: "2026.04.05 (토) 15:00~17:00", cat: "반려동물", status: "취소" },
  { studio: "블룸 웨딩 스튜디오", date: "2026.03.22 (토) 10:00~14:00", cat: "웨딩", status: "완료" },
];

type Screen = "home" | "category" | "myBookings" | "detail" | "booking" | "done" | "mypage" | "reviewWrite" | "myReviews" | "paymentHistory" | "login" | "signup" | "bizSignup" | "forgotPassword" | "notifications";
type Sort = "payments" | "rating" | "distance";
type BookingFilter = "예정" | "완료" | "취소";
type Tab = "home" | "category" | "mypage";

const TIMES = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function ConsumerApp() {
  const [adminCategories] = useCategories();
  const [homeKeywords] = useHomeKeywords();
  const [ads] = useAds();
  const [refundMatrix] = useRefundMatrix();
  const [categoryIcons] = useCategoryIcons();
  const [noShowReports] = useNoShowReports();
  const getCatIcon = (name: string) => resolveCatIcon(name, categoryIcons);
  const CATEGORIES = [{ name: "전체", Icon: LayoutGrid }, ...adminCategories.map(n => ({ name: n, Icon: getCatIcon(n) }))];
  const HOME_CATEGORY_GRID = adminCategories.map(n => ({ name: n, Icon: getCatIcon(n) }));
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedStudio, setSelectedStudio] = useState(STUDIOS[0]);
  const [tab, setTab] = useState<Tab>("home");
  const [sort, setSort] = useState<Sort>("payments");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [selectedDate, setSelectedDate] = useState(10);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("예정");
  const [adIdx, setAdIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewTarget, setReviewTarget] = useState("");
  const [myBookingPage, setMyBookingPage] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>(UPCOMING_BOOKINGS);
  const [cancelModal, setCancelModal] = useState<{ idx: number; studio: string } | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("김포토");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [categoryCat, setCategoryCat] = useState("프로필");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [customPriceMin, setCustomPriceMin] = useState<string>("");
  const [customPriceMax, setCustomPriceMax] = useState<string>("");
  const [activeKeyword, setActiveKeyword] = useState("인기");
  const [freeKeyword, setFreeKeyword] = useState<HomeKeyword | null>(null);
  const [detailEntryCat, setDetailEntryCat] = useState<string>(""); // 탐색 진입 카테고리
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [editingReviewIdx, setEditingReviewIdx] = useState<number | null>(null);
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState("");
  const [deleteRequestIdx, setDeleteRequestIdx] = useState<number | null>(null);
  const [deleteRequestReason, setDeleteRequestReason] = useState("");

  const touchStartX = useRef(0);
  const historyStack = useRef<{ s: Screen; t: Tab }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [introExpanded, setIntroExpanded] = useState(false);

  useEffect(() => {
    if (screen !== "home") return;
    const timer = window.setInterval(() => {
      setAdIdx(prev => (prev + 1) % HOME_AD_PAGES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [screen]);

  // 화면 전환 시 내부 스크롤 최상단으로 (특히 상세 진입)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (screen === "detail") setIntroExpanded(false);
  }, [screen, selectedStudio]);

  // 어드민에서 키워드가 변경/삭제된 경우 현재 선택값을 안전하게 리셋
  useEffect(() => {
    if (homeKeywords.length === 0) return;
    if (!homeKeywords.some(k => k.label === activeKeyword)) {
      setActiveKeyword(homeKeywords[0].label);
    }
  }, [homeKeywords, activeKeyword]);

  const navigate = (to: Screen) => {
    historyStack.current.push({ s: screen, t: tab });
    setScreen(to);
  };

  // 홈 상단 추천 검색어 칩 클릭 → 카테고리 탭으로 전환하며 필터 적용
  const applyHomeKeyword = (label: string) => {
    setActiveKeyword(label);
    const entry = homeKeywords.find(k => k.label === label);
    if (!label || label === "인기" || !entry) {
      setFreeKeyword(null);
      setCategoryCat("전체");
    } else if (entry.aliases.length === 0 && adminCategories.includes(label)) {
      setFreeKeyword(null);
      setCategoryCat(label);
    } else {
      setFreeKeyword(entry);
      setCategoryCat("전체");
    }
    historyStack.current.push({ s: screen, t: tab });
    setScreen("category");
    setTab("category");
  };
  const goBack = () => {
    if (screen === "home") return;
    const prev = historyStack.current.pop();
    if (prev) {
      setScreen(prev.s);
      setTab(prev.t);
    } else {
      setScreen("home");
      setTab("home");
    }
  };

  // 추천 스튜디오 = 어드민에서 '노출중'으로 편성한 광고 기준 (순서 유지).
  // 매칭 스튜디오 없거나 광고 0건이면 paymentCount 상위 4곳으로 fallback.
  const promotedStudios = (() => {
    const adStudios = ads
      .filter(a => a.status === "노출중")
      .map(a => STUDIOS.find(s => s.name === a.studio))
      .filter((s): s is typeof STUDIOS[number] => !!s);
    if (adStudios.length > 0) return adStudios.slice(0, 4);
    return [...STUDIOS].sort((a, b) => b.paymentCount - a.paymentCount).slice(0, 4);
  })();
  const hotStudios = [...STUDIOS].sort((a, b) => {
    if (b.paymentCount !== a.paymentCount) return b.paymentCount - a.paymentCount;
    return b.rating - a.rating;
  }).slice(0, 5);

  // 카테고리 탭: freeKeyword(자유검색) 우선 → 없으면 categoryCat + 지역 + 정렬
  const catFiltered = STUDIOS
    .filter(s => {
      if (freeKeyword) {
        const haystack = `${s.name} ${s.desc} ${s.area} ${s.cat} ${s.tags.join(" ")}`;
        return matchesKeyword(haystack, freeKeyword);
      }
      return categoryCat === "전체" || s.cat === categoryCat;
    })
    .filter(s => {
      if (selectedRegion === "전체" || !selectedRegion.trim()) return true;
      const kw = selectedRegion.trim().toLowerCase();
      return s.area.toLowerCase().includes(kw);
    });
  const catSorted = [...catFiltered].sort((a, b) => {
    if (sort === "rating") {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.paymentCount - a.paymentCount;
    }
    if (sort === "distance") {
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
      return b.rating - a.rating;
    }
    if (b.paymentCount !== a.paymentCount) return b.paymentCount - a.paymentCount;
    return b.rating - a.rating;
  });

  const toggleOption = (id: number) => setSelectedOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const timeIdx = TIMES.indexOf(selectedTime);
  const endTime = TIMES[Math.min(timeIdx + 1, TIMES.length - 1)] || "22:00";
  const packageList = [
    { title: "1컨셉", price: Math.round(selectedStudio.price * 0.9), desc: "보정본 4컷 · 30분 소요" },
    { title: "2컨셉", price: Math.round(selectedStudio.price * 1.4), desc: "보정본 7컷 · 60분 소요" },
    { title: "3컨셉", price: Math.round(selectedStudio.price * 1.9), desc: "보정본 12컷 · 90분 소요" },
  ];
  const selectedPackage = packageList[selectedPackageIdx] ?? packageList[0];
  const addonList = [
    { id: 101, name: "원본 추가", price: 40000 },
    { id: 102, name: "보정 컷 추가", price: 40000 },
  ];
  const basePrice = selectedPackage.price;
  const addonsTotal = selectedAddons.reduce((sum, id) => sum + (addonList.find(a => a.id === id)?.price || 0), 0);
  const optionsTotal = selectedOptions.reduce((sum, id) => sum + (HAIR_MAKEUP_OPTIONS.find(o => o.id === id)?.price || 0), 0);
  const totalPrice = basePrice + addonsTotal + optionsTotal;

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setAdIdx(prev => Math.min(prev + 1, 2));
    if (diff < -50) setAdIdx(prev => Math.max(prev - 1, 0));
  };

  const BOOKINGS_PER_PAGE = 3;
  const totalBookingPages = Math.ceil(ALL_MY_BOOKINGS_FOR_MYPAGE.length / BOOKINGS_PER_PAGE);
  const pagedBookings = ALL_MY_BOOKINGS_FOR_MYPAGE.slice(myBookingPage * BOOKINGS_PER_PAGE, (myBookingPage + 1) * BOOKINGS_PER_PAGE);
  const filteredBookings = bookingFilter === "예정" ? upcomingBookings : bookingFilter === "완료" ? COMPLETED_BOOKINGS : CANCELLED_BOOKINGS;

  const statusColor = (s: string) => {
    if (s === "확정" || s === "대기") return "bg-green-100 text-green-700";
    if (s === "완료") return "bg-gray-200 text-gray-500";
    if (s === "예약 취소 중") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-500";
  };

  // 상세 화면에서 표시할 포트폴리오 (IA-012: 카테고리별 갤러리)
  const detailPortfolio = (() => {
    if (detailEntryCat && selectedStudio.portfolios[detailEntryCat]) {
      return { cat: detailEntryCat, photos: selectedStudio.portfolios[detailEntryCat] };
    }
    return { cat: selectedStudio.cat, photos: selectedStudio.portfolios[selectedStudio.cat] || [] };
  })();

  const authScreens: Screen[] = ["login", "signup", "bizSignup", "forgotPassword"];
  const showHeader = !authScreens.includes(screen);

  const openDetail = (s: typeof STUDIOS[0], fromCat?: string) => {
    setSelectedStudio(s);
    setSelectedOptions([]);
    setDetailEntryCat(fromCat || "");
    navigate("detail");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <Link href="/" className="text-sm text-primary mb-4 hover:underline">← 메인으로</Link>
      <h2 className="text-xl font-bold mb-6 text-gray-900">소비자 화면</h2>

      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[28px] bg-white shadow-xl" style={{ height: 780 }}>

        {/* Header */}
        {showHeader && (
          <div className="relative z-10 bg-white pt-5 pl-4 pr-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {screen !== "home" && <button onClick={goBack} className="text-gray-500 text-lg flex items-center justify-center -mr-1">‹</button>}
                <button onClick={() => { setScreen("home"); setTab("home"); }} className="flex items-center">
                  <BrandMark />
                </button>
              </div>
              <button onClick={() => navigate("notifications")} className="text-gray-500 relative p-1">
                <Bell size={20} strokeWidth={1.5} />
                {(CONSUMER_NOTIFICATIONS.some(n => !n.read) || noShowReports.some(r => r.consumerName === userName)) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            </div>
          </div>
        )}

        <div ref={scrollRef} className="overflow-y-auto bg-white" style={{ height: showHeader ? "calc(780px - 64px - 56px)" : "calc(780px - 56px)" }}>

          {/* ===== HOME (IA-010) ===== */}
          {screen === "home" && (
            <div className="pb-6">
              <div className="px-4 pt-2">
                <div>
                  <p className="text-[11px] text-gray-400">포토팟 큐레이션</p>
                  <h2 className="mt-1 text-xl font-bold leading-tight text-gray-900">오늘의 촬영에 맞는 스튜디오를 찾아보세요</h2>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3">
                  <Search size={16} strokeWidth={1.8} className="text-gray-400" />
                  <input
                    type="text"
                    value={selectedRegion === "전체" ? "" : selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value || "전체")}
                    placeholder="어떤 스튜디오를 찾고 계신가요?"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>

                {homeKeywords.length > 0 && (
                  <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {homeKeywords.map(k => {
                      if (k.label === "인기") {
                        return (
                          <span
                            key={k.label}
                            className="shrink-0 whitespace-nowrap text-sm font-bold text-gray-900 pr-1"
                          >
                            {k.label}
                          </span>
                        );
                      }
                      return (
                        <button
                          key={k.label}
                          onClick={() => applyHomeKeyword(k.label)}
                          className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            activeKeyword === k.label
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 bg-white text-gray-500"
                          }`}
                        >
                          {k.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mx-4 mt-5 rounded-3xl bg-gray-50 p-3">
                <p className="text-[11px] font-semibold text-gray-700">이번 주 추천 배너</p>
                <div className="mt-3 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${adIdx * 100}%)` }}>
                    {HOME_AD_PAGES.map((page, pageIndex) => (
                      <div key={pageIndex} className="grid min-w-full grid-cols-3 gap-2">
                        {page.map(card => (
                          <button
                            key={card.title}
                            className={`h-32 rounded-2xl border border-gray-200 bg-gradient-to-br ${card.tone} p-3 text-left`}
                          >
                            <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
                              AD
                            </span>
                            <div className="mt-4 flex h-[76px] flex-col">
                              <p className="min-h-[32px] text-xs font-bold leading-tight text-gray-900">{card.title}</p>
                              <p className="mt-1 min-h-[28px] text-[10px] leading-snug text-gray-500">{card.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {HOME_AD_PAGES.map((_, i) => (
                      <button key={i} onClick={() => setAdIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === adIdx ? "bg-primary w-4" : "bg-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 px-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-gray-900">카테고리</h3>
                  <button
                    onClick={() => {
                      setScreen("category");
                      setTab("category");
                    }}
                    className="text-xs font-medium text-gray-400"
                  >
                    전체보기
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {HOME_CATEGORY_GRID.map(category => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setCategoryCat(category.name);
                        setScreen("category");
                        setTab("category");
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                        <category.Icon size={20} strokeWidth={1.7} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between px-4">
                  <div>
                    <p className="text-[11px] text-gray-400">예약·평점 TOP</p>
                    <h3 className="text-[15px] font-bold text-gray-900">지금 많이 찾는 스튜디오</h3>
                  </div>
                  <button
                    onClick={() => { setCategoryCat("전체"); setScreen("category"); setTab("category"); }}
                    className="text-xs font-medium text-gray-400 hover:text-primary">전체보기 →</button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
                  {hotStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        {index < 3 && (
                          <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold text-white">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{studio.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-[11px] text-gray-400 min-w-0">{studio.area}</p>
                          {studio.travelAvailable && (
                            <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                              출장 가능
                            </span>
                          )}
                        </div>
                        {studio.tags.length > 0 && (
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {studio.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-gray-500">
                          <span>예약 {studio.paymentCount}건</span>
                          <span className="text-yellow-500">★ {studio.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between px-4">
                  <div>
                    <p className="text-[11px] text-gray-400">에디터 셀렉션</p>
                    <h3 className="text-[15px] font-bold text-gray-900">지금 추천하는 스튜디오</h3>
                  </div>
                  <button
                    onClick={() => { setCategoryCat("전체"); setScreen("category"); setTab("category"); }}
                    className="text-xs font-medium text-gray-400 hover:text-primary">전체보기 →</button>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
                  {promotedStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={28} strokeWidth={1.5} />
                        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
                          AD #{index + 1}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{studio.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-[11px] text-gray-400 min-w-0">{studio.area}</p>
                          {studio.travelAvailable && (
                            <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                              출장 가능
                            </span>
                          )}
                        </div>
                        {studio.tags.length > 0 && (
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {studio.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2 text-[11px]">
                          <span className="font-bold text-gray-900">₩{studio.price.toLocaleString()}</span>
                          <span className="text-yellow-500">★ {studio.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ===== CATEGORY (IA-011) ===== */}
          {screen === "category" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">카테고리</h2>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {CATEGORIES.map(c => (
                  <button key={c.name} onClick={() => { setFreeKeyword(null); setCategoryCat(c.name); }}
                    className="flex flex-col items-center gap-1.5 py-2">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${!freeKeyword && categoryCat === c.name ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-gray-600"}`}>
                      <c.Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[10px] ${!freeKeyword && categoryCat === c.name ? "text-primary font-semibold" : "text-gray-600"}`}>{c.name}</span>
                  </button>
                ))}
              </div>

              {/* 지역 검색 */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-2 border border-gray-100">
                  <MapPin size={13} strokeWidth={1.5} className="text-gray-400" />
                  <input type="text" value={selectedRegion === "전체" ? "" : selectedRegion} onChange={e => setSelectedRegion(e.target.value || "전체")}
                    placeholder="지역 검색 (예: 잠실, 강남)" className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400" />
                  {selectedRegion !== "전체" && (
                    <button onClick={() => setSelectedRegion("전체")} className="text-gray-400 text-xs">✕</button>
                  )}
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                {freeKeyword ? (
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 shrink-0">
                      🔎 {freeKeyword.label}
                      <button onClick={() => setFreeKeyword(null)} className="text-primary/60 hover:text-primary ml-0.5" aria-label="검색어 삭제">✕</button>
                    </span>
                    <p className="text-sm font-bold whitespace-nowrap">검색 결과 {catSorted.length}곳</p>
                  </div>
                ) : (
                  <p className="text-sm font-bold whitespace-nowrap min-w-0 truncate">&lsquo;{categoryCat}&rsquo; 스튜디오 {catSorted.length}곳</p>
                )}

                {/* 정렬 드롭다운 — 오른쪽 끝 */}
                {(() => {
                  const sortItems = [
                    { key: "payments" as Sort, label: "예약순" },
                    { key: "rating" as Sort, label: "평점순" },
                    { key: "distance" as Sort, label: "거리순" },
                  ];
                  const currentLabel = sortItems.find(i => i.key === sort)?.label ?? "예약순";
                  return (
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setSortOpen(v => !v)}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                        <SlidersHorizontal size={13} strokeWidth={1.8} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{currentLabel}</span>
                        <ChevronDown size={13} strokeWidth={2} className={`text-gray-500 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                      </button>
                      {sortOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                          <div className="absolute right-0 top-full z-30 mt-1.5 min-w-[120px] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                            {sortItems.map(item => (
                              <button
                                key={item.key}
                                onClick={() => { setSort(item.key); setSortOpen(false); }}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                                  sort === item.key ? "bg-primary/5 text-primary font-semibold" : "text-gray-700 hover:bg-gray-50"
                                }`}>
                                {item.label}
                                {sort === item.key && <Check size={14} strokeWidth={2.5} className="text-primary" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* 스튜디오 리스트 상단 광고 배너 (REQ-113) */}
              <div className="mb-3 overflow-hidden rounded-xl">
                <div className="bg-gradient-to-r from-rose-100 to-pink-200 rounded-xl p-4 flex items-center gap-3 relative">
                  <span className="absolute top-2 left-2 bg-primary/80 text-white text-[9px] px-2 py-0.5 rounded font-medium">AD</span>
                  <div className="w-14 h-14 bg-white/60 rounded-lg flex items-center justify-center shrink-0 text-gray-400"><ImageIcon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">카테고리별 추천 배너</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">관리자가 등록한 광고 배너 영역</p>
                  </div>
                </div>
              </div>

              {catSorted.map(s => (
                <div key={s.id} onClick={() => openDetail(s, categoryCat)}
                  className="flex gap-3 py-3 border-b border-gray-50 cursor-pointer">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={22} strokeWidth={1.5} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{s.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                      <p className="text-xs text-gray-400 shrink-0">{s.cat} · {s.area}</p>
                      {s.travelAvailable && (
                        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                          출장 가능
                        </span>
                      )}
                    </div>
                    {s.tags.length > 0 && (
                      <div className="mt-1 flex gap-1 flex-wrap">
                        {s.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold">₩{s.price.toLocaleString()}</span>
                      <span className="text-xs text-yellow-500">★ {s.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== DETAIL (IA-012) ===== */}
          {screen === "detail" && (
            <div>
              <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative text-gray-400">
                <ImageIcon size={56} strokeWidth={1} />
                <button onClick={goBack} className="absolute top-3 left-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-sm shadow text-gray-700">‹</button>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-0.5">{selectedStudio.name}</h2>
                <p className="text-xs text-gray-400">{selectedStudio.area}</p>
                <div className="flex items-center gap-2 mt-1 mb-4 flex-wrap">
                  <span className="text-xs text-yellow-500">★ {selectedStudio.rating}</span>
                  <span className="text-xs text-gray-400">리뷰 {selectedStudio.reviews}개</span>
                  {selectedStudio.travelAvailable && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">출장 가능</span>}
                </div>

                {/* 스튜디오 소개 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">스튜디오 소개</p>
                  {selectedStudio.intro ? (() => {
                    const full = selectedStudio.intro;
                    const firstBreak = full.indexOf("\n\n");
                    const preview = firstBreak > 0 && firstBreak < 400 ? full.slice(0, firstBreak) : full.slice(0, 200);
                    const isLong = full.length > preview.length;
                    return (
                      <>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {introExpanded || !isLong ? full : `${preview}…`}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => setIntroExpanded(v => !v)}
                            className="mt-2 text-xs text-primary font-medium hover:underline"
                          >
                            {introExpanded ? "접기 ▲" : "전체 보기 ▼"}
                          </button>
                        )}
                      </>
                    );
                  })() : (
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedStudio.desc}. {selectedStudio.area}에 위치한 {selectedStudio.cat} 전문 스튜디오입니다. 편안한 분위기에서 최고의 결과물을 제공해드려요.</p>
                  )}
                  {selectedStudio.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedStudio.tags.map(t => (
                        <span key={t} className="text-[11px] text-primary bg-primary/5 px-2 py-0.5 rounded-full">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 가격 패키지 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500 font-medium">가격 패키지</p>
                    <span className="text-[10px] text-gray-400">{selectedStudio.vatIncluded ? "VAT 포함" : "VAT 별도"}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: "1컨셉", price: Math.round(selectedStudio.price * 0.9), desc: "보정본 4컷 · 30분 소요" },
                      { title: "2컨셉", price: Math.round(selectedStudio.price * 1.4), desc: "보정본 7컷 · 60분 소요" },
                      { title: "3컨셉", price: Math.round(selectedStudio.price * 1.9), desc: "보정본 12컷 · 90분 소요" },
                    ].map((pkg, idx) => (
                      <button key={idx} onClick={() => setSelectedPackageIdx(idx)}
                        className={`w-full flex justify-between items-start p-3 rounded-lg border text-left transition-all ${selectedPackageIdx === idx ? "border-primary bg-primary/5" : "border-gray-200 bg-white"}`}>
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPackageIdx === idx ? "border-primary bg-primary" : "border-gray-300"}`}>
                            {selectedPackageIdx === idx && <Check size={10} strokeWidth={3} className="text-white" />}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{pkg.title}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{pkg.desc}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold shrink-0">₩{pkg.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 추가 옵션 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">추가 옵션</p>
                  <div className="space-y-2">
                    {[
                      { id: 101, name: "원본 추가", price: 40000 },
                      { id: 102, name: "보정 컷 추가", price: 40000 },
                    ].map(addon => (
                      <button key={addon.id} onClick={() => setSelectedAddons(prev => prev.includes(addon.id) ? prev.filter(x => x !== addon.id) : [...prev, addon.id])}
                        className={`w-full flex justify-between items-center p-3 rounded-lg border text-left transition-all ${selectedAddons.includes(addon.id) ? "border-primary bg-primary/5" : "border-gray-200 bg-white"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddons.includes(addon.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                            {selectedAddons.includes(addon.id) && <Check size={10} strokeWidth={3} className="text-white" />}
                          </span>
                          <span className="text-sm">{addon.name}</span>
                        </div>
                        <span className="text-sm font-medium">+₩{addon.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 헤어/메이크업 옵션 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">헤어 / 메이크업 옵션</p>
                  <div className="space-y-2">
                    {HAIR_MAKEUP_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => toggleOption(opt.id)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg border text-left transition-all ${selectedOptions.includes(opt.id) ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedOptions.includes(opt.id) ? "border-primary bg-primary" : "border-gray-300"}`}>
                            {selectedOptions.includes(opt.id) && <Check size={10} strokeWidth={3} className="text-white" />}
                          </span>
                          <span className="text-sm">{opt.name}</span>
                        </div>
                        <span className="text-sm font-medium">+₩{opt.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 카테고리별 포트폴리오 (IA-012 / REQ-106) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500 font-medium">{detailPortfolio.cat} 포트폴리오</p>
                    <span className="text-[10px] text-gray-400">최대 30장</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                    {detailPortfolio.photos.map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={20} strokeWidth={1} /></div>
                    ))}
                  </div>
                </div>

                {/* 위치 (지도) - REQ-106 */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">위치</p>
                  <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <MapPin size={32} strokeWidth={1.5} className="text-primary z-10" />
                      <span className="absolute bottom-2 right-2 text-[9px] bg-white/90 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200 z-10">카카오맵 연동 예정</span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-700">{selectedStudio.location}</p>
                      <a href={`tel:${selectedStudio.phone}`} className="flex items-center gap-1 text-[10px] text-primary mt-1">
                        <Phone size={12} strokeWidth={1.5} /> {selectedStudio.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Reviews (IA-031) */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">리뷰 {selectedStudio.reviews}개</p>
                  <div className="space-y-2">
                    {[
                      { name: "김**", rating: 5, text: "분위기 너무 좋아요! 사진 결과물도 만족합니다", date: "2026.04.10", reply: "감사합니다! 다음에도 좋은 촬영 하겠습니다." },
                      { name: "이**", rating: 4, text: "접근성이 좋고 시설이 깔끔해요", date: "2026.04.08", reply: null },
                    ].map((r, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-medium">{r.name}</span>
                          <span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                          <span className="ml-auto text-[10px] text-gray-400">{r.date}</span>
                        </div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                        {r.reply && (
                          <div className="bg-gray-50 rounded-lg p-2.5 mt-2 border border-gray-100">
                            <p className="text-[10px] text-primary font-medium mb-0.5">업체 답변</p>
                            <p className="text-xs text-gray-600">{r.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">날짜 선택</p>
                    {/* 월간 캘린더 뷰 */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-center mb-2">2026년 5월</p>
                      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-gray-400 mb-1">
                        {["일","월","화","수","목","금","토"].map(d => <div key={d}>{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-0.5 text-center">
                        {/* 5월 1일 = 금요일 → 앞에 빈칸 5개 */}
                        {Array.from({ length: 5 }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const isAvailable = [5, 10, 11, 13, 15, 18, 20, 25].includes(day);
                          return (
                            <button key={day} onClick={() => setSelectedDate(day)}
                              className={`py-1 rounded text-[11px] transition-all ${selectedDate === day ? (isAvailable ? "bg-primary text-white font-bold" : "bg-gray-300 text-gray-500 font-bold") : isAvailable ? "bg-primary/10 text-primary font-medium" : "text-gray-400 hover:bg-gray-100"}`}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-3 mt-2 text-[9px] text-gray-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> 선택됨</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary/20 rounded-full" /> 예약 가능</span>
                      </div>
                    </div>
                  <p className="text-sm font-medium mb-2 mt-3">시간 선택</p>
                  {(() => {
                    const isDateAvailable = [5, 10, 11, 13, 15, 18, 20, 25].includes(selectedDate);
                    return (
                      <>
                        {!isDateAvailable && (
                          <p className="text-[10px] text-red-500 mb-1.5">선택한 날짜는 예약 불가입니다. 다른 날짜를 선택해주세요.</p>
                        )}
                        <div className="grid grid-cols-4 gap-1.5">
                          {TIMES.map(t => {
                            const booked = BOOKED_TIMES.includes(t);
                            const disabled = !isDateAvailable || booked;
                            return (
                              <button key={t} onClick={() => !disabled && setSelectedTime(t)} disabled={disabled}
                                className={`rounded-lg py-2 text-center text-xs transition-all ${disabled ? "bg-gray-200 text-gray-300 line-through cursor-not-allowed" : selectedTime === t ? "bg-primary text-white font-bold" : "bg-gray-100 text-gray-600"}`}>{t}</button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* CTA: 예약 + 문의(전화) */}
                <div className="flex gap-2">
                  <a href={`tel:${selectedStudio.phone}`} className="flex items-center justify-center w-14 h-12 border border-gray-300 rounded-xl text-gray-500 shrink-0">
                    <Phone size={18} strokeWidth={1.5} />
                  </a>
                  <button onClick={() => navigate("booking")} className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-sm">예약하기</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== BOOKING (IA-020) ===== */}
          {screen === "booking" && (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">예약 확인</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-bold text-sm">{selectedStudio.name}</p>
                <p className="text-xs text-gray-400 mt-1">{selectedStudio.cat} · {selectedStudio.area}</p>
              </div>
              <div className="space-y-3 mb-4 px-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">날짜</span><span className="font-medium">2026.05.{selectedDate} ({["목","금","토","일","월","화","수"][selectedDate - 8]})</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">시간</span><span className="font-medium">{selectedTime} ~ {endTime} (1시간)</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">{selectedPackage.title}</span><span className="font-medium">₩{basePrice.toLocaleString()}</span></div>
                {selectedAddons.length > 0 && selectedAddons.map(id => {
                  const addon = addonList.find(a => a.id === id);
                  return addon ? <div key={id} className="flex justify-between text-sm"><span className="text-gray-500">{addon.name}</span><span className="font-medium">+₩{addon.price.toLocaleString()}</span></div> : null;
                })}
                {selectedOptions.length > 0 && selectedOptions.map(id => {
                  const opt = HAIR_MAKEUP_OPTIONS.find(o => o.id === id);
                  return opt ? <div key={id} className="flex justify-between text-sm"><span className="text-gray-500">{opt.name}</span><span className="font-medium">+₩{opt.price.toLocaleString()}</span></div> : null;
                })}
                <div className="flex justify-between text-sm border-t border-gray-100 pt-3"><span className="text-gray-500 font-bold">총 금액</span><span className="font-bold text-primary text-base">₩{totalPrice.toLocaleString()}</span></div>
                <p className="text-[11px] text-gray-400 pt-1">예약금 결제 후 업체 승인 시 확정되며, 영업일 기준 48시간 내 미승인 시 자동 취소 및 전액 환불됩니다.</p>
              </div>

              <button onClick={() => navigate("done")} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm">결제하기 · 토스페이먼츠</button>
            </div>
          )}

          {/* ===== DONE (IA-022) ===== */}
          {screen === "done" && (
            <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 500 }}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary"><CheckCircle2 size={48} strokeWidth={1.5} /></div>
              <h2 className="text-lg font-bold mb-1">예약 요청 완료!</h2>
              <p className="text-sm text-gray-500">{selectedStudio.name}</p>
              <p className="text-xs text-gray-400 mb-6">2026.05.{selectedDate} {selectedTime} ~ {endTime}</p>
              <div className="bg-primary/5 rounded-xl p-4 w-full mb-4 border border-primary/10">
                <p className="text-xs text-primary font-medium">토스페이먼츠 예약금 결제 완료</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₩{totalPrice.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500 mt-2">업체 승인 후 예약이 확정되며, 영업일 기준 48시간 내 미승인 시 자동 취소 및 전액 환불됩니다.</p>
              </div>
              <button onClick={() => { setScreen("myBookings"); setTab("mypage"); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm mb-2">예약 요청 내역 확인</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm">홈으로</button>
            </div>
          )}

          {/* ===== MY BOOKINGS (IA-023/051) ===== */}
          {screen === "myBookings" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 예약</h2>
              <div className="flex gap-2 mb-4">
                {(["예정", "완료", "취소"] as BookingFilter[]).map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${bookingFilter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{f} {f === "예정" ? upcomingBookings.length : f === "완료" ? COMPLETED_BOOKINGS.length : CANCELLED_BOOKINGS.length}</button>
                ))}
              </div>
              {bookingFilter === "완료" && <p className="text-[11px] text-gray-400 mb-3">리뷰는 업체가 촬영 건을 완료 처리한 시점부터 2주 이내 작성, 작성 후 3일 이내 수정 가능합니다.</p>}
              {bookingFilter === "취소" && (
                <div className="mb-3 rounded-xl bg-rose-50 p-3 text-[11px] text-rose-500">
                  <p>소비자 취소 환불 기준: 7일 전 전액 환불 · 3~6일 전 20% · 1~2일 전 50% · 당일 80%</p>
                  <p className="mt-1">업체 취소: 100% 환불 + 업체에 페널티 누적 기록 (누적 5회 이상 시 이용정지 검토)</p>
                </div>
              )}
              {filteredBookings.length === 0 ? <div className="text-center py-12"><p className="text-gray-400 text-sm">해당 예약이 없습니다</p></div> : filteredBookings.map((b, i) => {
                const cancelReason = (b as UpcomingBooking).cancelReason;
                const linkedStudio = STUDIOS.find(s => s.name === b.studio);
                return (
                <div
                  key={i}
                  onClick={() => { if (linkedStudio) openDetail(linkedStudio); }}
                  className={`bg-gray-50 rounded-xl p-4 mb-3 transition-all ${bookingFilter === "취소" ? "opacity-60" : ""} ${linkedStudio ? "cursor-pointer hover:bg-gray-100" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="text-sm font-bold">{b.studio}</p><p className="text-xs text-gray-400 mt-0.5">{b.cat} · {b.date}</p><p className="text-xs text-gray-400">{b.time}</p></div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  {b.status === "예약 취소 중" && cancelReason && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 mb-2">
                      <p className="text-[10px] text-amber-700 font-medium mb-0.5">취소 사유</p>
                      <p className="text-[11px] text-gray-700">{cancelReason}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold">{b.price}</span>
                    <div className="flex items-center gap-2">
                      {bookingFilter === "예정" && b.status !== "예약 취소 중" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setCancelModal({ idx: i, studio: b.studio }); setCancelReasonInput(""); }}
                          className="text-xs text-red-500 bg-red-50 px-2.5 py-1 rounded-full font-medium">
                          예약 취소
                        </button>
                      )}
                      {bookingFilter === "예정" && b.status === "예약 취소 중" && (
                        <span className="text-[10px] text-amber-600">업체 승인 대기 중</span>
                      )}
                      {bookingFilter === "완료" && (b as { canReview?: boolean }).canReview && (
                        <button onClick={(e) => { e.stopPropagation(); setReviewTarget(b.studio); setReviewRating(5); setReviewText(""); navigate("reviewWrite"); }} className="text-xs text-primary font-medium">리뷰 작성 →</button>
                      )}
                      {bookingFilter === "취소" && <span className="text-[10px] text-gray-400">{(b as { reason?: string }).reason}</span>}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          {/* ===== CANCEL MODAL ===== */}
          {cancelModal && (() => {
            const bk = upcomingBookings[cancelModal.idx];
            const cat = bk?.cat ?? "";
            const parseDate = (s: string) => {
              const m = /(\d{4})\.(\d{1,2})\.(\d{1,2})/.exec(s);
              if (!m) return null;
              return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
            };
            const shootDate = bk ? parseDate(bk.date) : null;
            const today = new Date("2026-04-23");
            const daysUntil = shootDate ? Math.floor((shootDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
            const price = bk ? Number(bk.price.replace(/[^\d]/g, "")) : 0;
            const { period, rate, fromDefault } = pickRefundRate(refundMatrix, cat, daysUntil);
            const refundAmount = Math.round(price * rate / 100);
            const fee = price - refundAmount;
            return (
            <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setCancelModal(null)}>
              <div onClick={(e) => e.stopPropagation()}
                className="w-full bg-white rounded-t-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">예약 취소</h3>
                  <button onClick={() => setCancelModal(null)} className="text-gray-400">✕</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold mb-1">{cancelModal.studio}</p>
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-gray-500 mb-2">
                    <span className="bg-white rounded px-1.5 py-0.5 font-medium">{cat}</span>
                    <span>·</span>
                    <span>촬영까지 {daysUntil >= 0 ? `${daysUntil}일` : "지남"}</span>
                    <span>·</span>
                    <span>구간: <b>{REFUND_PERIOD_LABELS[period]}</b></span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] text-gray-500">결제 금액</span>
                      <span className="text-xs font-medium">₩{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] text-gray-500">적용 환불율</span>
                      <span className="text-xs font-medium text-primary">{rate}%</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] text-gray-500">취소 수수료</span>
                      <span className="text-xs text-gray-500">-₩{fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1.5 border-t border-gray-100 mt-1.5">
                      <span className="text-[11px] text-gray-700 font-bold">예상 환불 금액</span>
                      <span className="text-sm font-bold text-red-500">₩{refundAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  {fromDefault && (
                    <p className="text-[9px] text-amber-600 mt-1.5">※ &lsquo;{cat}&rsquo; 카테고리 환불율 미설정 — 첫 카테고리 기준값 적용</p>
                  )}
                  <p className="text-[9px] text-gray-400 mt-1.5">※ 최종 환불은 업체 승인 후 확정됩니다. 업체 귀책 취소는 100% 환불 + 업체 페널티.</p>
                </div>
                <p className="text-xs font-medium mb-1.5">취소 사유</p>
                <textarea
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                  placeholder="업체와 어드민이 확인합니다. 구체적으로 작성해주세요 (5자 이상)"
                  rows={4}
                  maxLength={200}
                  className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none resize-none border border-gray-200 focus:border-primary"
                />
                <div className="flex items-center justify-end mb-3">
                  <p className="text-[10px] text-gray-400">{cancelReasonInput.length}/200</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCancelModal(null)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-sm font-medium">돌아가기</button>
                  <button
                    onClick={() => {
                      setUpcomingBookings(prev => prev.map((bk, j) => j === cancelModal.idx ? { ...bk, status: "예약 취소 중", cancelReason: cancelReasonInput.trim() } : bk));
                      setCancelModal(null);
                      setCancelReasonInput("");
                    }}
                    disabled={cancelReasonInput.trim().length < 5}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold ${cancelReasonInput.trim().length >= 5 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                    취소 요청
                  </button>
                </div>
              </div>
            </div>
            );
          })()}

          {/* ===== REVIEW WRITE (IA-030) ===== */}
          {screen === "reviewWrite" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">리뷰 작성</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-sm font-bold">{reviewTarget}</p></div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">별점</p>
                <div className="flex gap-2 justify-center">{[1,2,3,4,5].map(star => <button key={star} onClick={() => setReviewRating(star)} className={`text-3xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}>{star <= reviewRating ? "★" : "☆"}</button>)}</div>
                <p className="text-center text-xs text-gray-400 mt-2">{reviewRating}점</p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">리뷰 내용</p>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} maxLength={300} placeholder="촬영 경험을 30자 이상 작성해주세요" className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none resize-none border border-gray-200 focus:border-primary" rows={5} />
                <div className="mt-1 flex items-center justify-end">
                  <p className="text-[10px] text-gray-400">{reviewText.length}/300</p>
                </div>
              </div>
              <button onClick={() => { setScreen("myBookings"); setTab("mypage"); }} disabled={reviewText.trim().length < 30} className={`w-full py-3.5 rounded-xl font-bold text-sm ${reviewText.trim().length >= 30 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>리뷰 등록</button>
            </div>
          )}

          {/* ===== MY REVIEWS (IA-053) ===== */}
          {screen === "myReviews" && editingReviewIdx === null && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">내 리뷰 관리</h2>
              {MY_REVIEWS_DATA.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-start mb-2"><div><p className="text-sm font-bold">{r.studio}</p><p className="text-xs text-gray-400 mt-0.5">{r.date}</p></div><span className="text-xs text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                  <p className="text-xs text-gray-600">{r.text}</p>
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={() => { setEditingReviewIdx(i); setEditReviewRating(r.rating); setEditReviewText(r.text); }} className="text-[10px] text-primary px-2 py-1 font-medium">수정</button>
                    <button onClick={() => { setDeleteRequestIdx(i); setDeleteRequestReason(""); }} className="text-[10px] text-red-400 px-2 py-1">삭제 요청</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== MY REVIEW EDIT ===== */}
          {screen === "myReviews" && editingReviewIdx !== null && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">리뷰 수정</h2>
              <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-sm font-bold">{MY_REVIEWS_DATA[editingReviewIdx].studio}</p><p className="text-xs text-gray-400 mt-0.5">{MY_REVIEWS_DATA[editingReviewIdx].date}</p></div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">별점</p>
                <div className="flex gap-2 justify-center">{[1,2,3,4,5].map(star => <button key={star} onClick={() => setEditReviewRating(star)} className={`text-3xl ${star <= editReviewRating ? "text-yellow-400" : "text-gray-300"}`}>{star <= editReviewRating ? "★" : "☆"}</button>)}</div>
                <p className="text-center text-xs text-gray-400 mt-2">{editReviewRating}점</p>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">리뷰 내용</p>
                <textarea value={editReviewText} onChange={e => setEditReviewText(e.target.value)} maxLength={300} className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none resize-none border border-gray-200 focus:border-primary" rows={5} />
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-gray-400">30자 이상 입력해야 수정 가능 · 삭제는 요청 후 승인됩니다.</p>
                  <p className="text-[10px] text-gray-400 shrink-0">{editReviewText.length}/300</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingReviewIdx(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium text-sm">취소</button>
                <button onClick={() => setEditingReviewIdx(null)} disabled={editReviewText.trim().length < 30} className={`flex-1 py-3 rounded-xl font-bold text-sm ${editReviewText.trim().length >= 30 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>수정 완료</button>
              </div>
            </div>
          )}

          {/* ===== PAYMENT HISTORY (IA-052) ===== */}
          {screen === "paymentHistory" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">결제 내역</h2>
              {PAYMENT_HISTORY.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-50">
                  <div><p className="text-sm font-medium">{p.studio}</p><p className="text-xs text-gray-400 mt-0.5">{p.date} · {p.method}</p></div>
                  <div className="text-right"><p className={`text-sm font-bold ${p.status === "환불완료" ? "text-red-500" : "text-gray-900"}`}>{p.status === "환불완료" ? "-" : ""}{p.amount}</p><p className={`text-[10px] ${p.status === "환불완료" ? "text-red-400" : "text-green-500"}`}>{p.status}</p></div>
                </div>
              ))}
            </div>
          )}

          {/* ===== MY PAGE (IA-050) ===== */}
          {screen === "mypage" && (
            <div className="p-4">
              {/* 프로필 편집 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden">
                    {profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <User size={26} strokeWidth={1.5} />
                    )}
                  </div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => setProfileImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button onClick={() => profileInputRef.current?.click()}
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow">
                    <Camera size={11} strokeWidth={2} />
                  </button>
                </div>
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="flex items-center gap-2"><input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="text-sm font-bold border-b border-primary outline-none bg-transparent w-24" autoFocus /><button onClick={() => setIsEditingProfile(false)} className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-1 rounded">완료</button></div>
                  ) : (<div className="flex items-center gap-2"><p className="font-bold">{userName}</p><button onClick={() => setIsEditingProfile(true)} className="text-gray-400"><Pencil size={12} strokeWidth={1.5} /></button></div>)}
                </div>
              </div>

              {/* 추천 스튜디오 — 어드민 광고 노출중 기준 (MY용 컴팩트) */}
              <div className="mb-5 -mx-4">
                <div className="mb-2.5 flex items-center justify-between px-4">
                  <div>
                    <p className="text-[10px] text-gray-400">지금 추천하는 스튜디오</p>
                    <h3 className="text-sm font-bold text-gray-900">오늘은 이런 곳 어때요?</h3>
                  </div>
                  <button onClick={() => { setCategoryCat("전체"); setScreen("category"); setTab("category"); }}
                    className="text-[11px] font-medium text-gray-400 hover:text-primary">전체보기 →</button>
                </div>
                <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
                  {promotedStudios.map((studio, index) => (
                    <button
                      key={studio.id}
                      onClick={() => openDetail(studio)}
                      className="flex w-28 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm"
                    >
                      <div className="relative flex h-20 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <ImageIcon size={20} strokeWidth={1.5} />
                        <span className="absolute left-1 top-1 rounded-full bg-white/85 px-1.5 py-0.5 text-[8px] font-semibold text-gray-500">
                          AD #{index + 1}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-2">
                        <p className="truncate text-[11px] font-semibold text-gray-900">{studio.name}</p>
                        <p className="truncate text-[9px] text-gray-400">{studio.area}</p>
                        <div className="mt-auto flex items-center justify-between pt-1">
                          <span className="text-[10px] font-bold text-gray-900">₩{studio.price.toLocaleString()}</span>
                          <span className="text-[9px] text-yellow-500">★ {studio.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-0">
                <button onClick={() => navigate("myBookings")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">내 예약 내역</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => navigate("myReviews")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">내 리뷰 관리</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => navigate("paymentHistory")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">결제 내역</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">고객센터</span><span className="text-gray-300 text-xs">›</span>
                </button>
                <button onClick={() => navigate("login")} className="flex justify-between items-center py-3.5 border-b border-gray-50 w-full text-left">
                  <span className="text-sm">로그아웃</span><span className="text-gray-300 text-xs">›</span>
                </button>
              </div>
            </div>
          )}

          {/* ===== LOGIN (IA-003) ===== */}
          {screen === "login" && (
            <div className="p-6 pt-16 flex flex-col items-center">
              <Image src="/photopop-logo.png" alt="포토팟 로고" width={88} height={88} className="mb-3 h-[88px] w-[88px] object-contain" />
              <p className="text-3xl font-bold text-primary mb-2">포토팟</p>
              <p className="text-xs text-gray-400 mb-10">스튜디오 대관·예약 플랫폼</p>

              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">💬 카카오로 시작하기</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2">🟢 네이버로 시작하기</button>
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm mb-6 flex items-center justify-center gap-2">G 구글로 시작하기</button>

              <div className="flex items-center gap-4 w-full mb-6">
                <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">또는</span><div className="flex-1 h-px bg-gray-200" />
              </div>

              <input type="email" placeholder="이메일" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 mb-2" />
              <input type="password" placeholder="비밀번호" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 mb-4" />
              <button onClick={() => { setScreen("home"); setTab("home"); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm mb-4">로그인</button>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <button onClick={() => navigate("signup")}>회원가입</button>
                <span>|</span>
                <button onClick={() => navigate("forgotPassword")}>비밀번호 찾기</button>
              </div>

              <div className="mt-8 w-full">
                <button onClick={() => navigate("bizSignup")} className="w-full border border-primary text-primary py-3 rounded-xl font-medium text-sm">🏢 업체 회원가입</button>
              </div>
            </div>
          )}

          {/* ===== SIGNUP (IA-001) ===== */}
          {screen === "signup" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">회원가입</h2>
              <p className="text-xs text-gray-400 mb-6">소비자 계정</p>


              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">이름</p><input type="text" placeholder="홍길동" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">닉네임 (앱 내 표시)</p><input type="text" placeholder="포토팟유저" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">이메일</p><input type="email" placeholder="email@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">비밀번호</p><input type="password" placeholder="8자 이상" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
              </div>

              {/* 약관 동의 (REQ-101) */}
              <div className="space-y-2 mb-4 bg-gray-50 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 서비스 이용약관 동의</span>
                  <span className="text-[10px] text-gray-400 underline">보기</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 개인정보 처리방침 동의</span>
                  <span className="text-[10px] text-gray-400 underline">보기</span>
                </label>
              </div>

              <p className="text-xs text-gray-400 mb-3">또는 SNS로 가입</p>
              <button className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm mb-2">💬 카카오로 가입</button>
              <button className="w-full bg-[#03C75A] text-white py-3 rounded-xl font-bold text-sm mb-2">🟢 네이버로 가입</button>
              <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm mb-6">G 구글로 가입</button>

              <button onClick={() => { if (agreeTerms && agreePrivacy) { setScreen("home"); setTab("home"); } }} disabled={!agreeTerms || !agreePrivacy}
                className={`w-full py-3 rounded-xl font-bold text-sm ${agreeTerms && agreePrivacy ? "bg-primary text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>가입 완료</button>
            </div>
          )}

          {/* ===== BIZ SIGNUP (IA-002) ===== */}
          {screen === "bizSignup" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">업체 회원가입</h2>
              <p className="text-xs text-gray-400 mb-6">사업자 계정 · 승인 후 이용 가능</p>

              <div className="space-y-3 mb-4">
                <div><p className="text-xs text-gray-500 mb-1">업체명</p><input type="text" placeholder="스튜디오명" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">대표자명</p><input type="text" placeholder="홍길동" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">사업자등록번호</p><input type="text" placeholder="000-00-00000" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">연락처</p><input type="tel" placeholder="02-0000-0000" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">이메일</p><input type="email" placeholder="biz@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
                <div><p className="text-xs text-gray-500 mb-1">비밀번호</p><input type="password" placeholder="8자 이상" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" /></div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">스튜디오/작업물 사진 업로드</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300"><span className="text-xl text-gray-400">+</span></div>
                  {[1,2,3].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl" />)}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">심사 시 활용됩니다</p>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-2 mb-4 bg-gray-50 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 서비스 이용약관 동의</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#E85D93]" />
                  <span className="text-xs flex-1"><span className="text-red-500">*</span> 개인정보 처리방침 동의</span>
                </label>
              </div>

              <button onClick={() => { setScreen("login"); }} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm mb-3">가입 신청</button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 mb-1">📋 승인 안내</p>
                <div className="space-y-1 text-[10px] text-amber-600">
                  <p>• 심사는 2~3일 소요될 수 있습니다</p>
                  <p>• 전화 확인이 진행될 수 있으니 전화를 받아주세요</p>
                  <p>• 결과는 등록하신 이메일로 안내됩니다</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== FORGOT PASSWORD (IA-004) ===== */}
          {screen === "forgotPassword" && (
            <div className="p-6 pt-16">
              <h2 className="text-lg font-bold mb-1">비밀번호 찾기</h2>
              <p className="text-xs text-gray-400 mb-8">가입 시 사용한 이메일로 재설정 링크를 발송합니다</p>
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-1">이메일</p>
                <input type="email" placeholder="email@example.com" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200" />
              </div>
              <button onClick={goBack} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm mb-4">비밀번호 재설정 링크 발송</button>
              <p className="text-center text-[10px] text-gray-400">입력한 이메일로 비밀번호 재설정 링크가 전송됩니다</p>
            </div>
          )}

          {/* ===== NOTIFICATIONS (IA-040) ===== */}
          {screen === "notifications" && (
            <div className="p-4">
              <h2 className="text-base font-bold mb-4">알림</h2>
              {/* 노쇼 알림 — 업체 신고 즉시 반영 */}
              {noShowReports.filter(r => r.consumerName === userName).map(r => (
                <div key={r.id} className="flex gap-3 py-3.5 border-b border-gray-50 w-full text-left bg-red-50/40">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500">
                    <Bell size={16} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">
                      &lsquo;{r.studioName}&rsquo;이(가) 회원님 예약을 <span className="text-red-600 font-bold">노쇼로 처리</span>했습니다
                    </p>
                    {r.reason && <p className="text-[11px] text-gray-600 mt-0.5 bg-white rounded px-2 py-1 border border-red-100">사유: {r.reason}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(r.reportedAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })} · 예약번호 {r.bookingId}
                    </p>
                    <p className="text-[10px] text-red-600 mt-1">※ 노쇼 누적 시 이용 제한이 될 수 있어요. 이의 있으시면 고객센터로 문의.</p>
                  </div>
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0" />
                </div>
              ))}
              {CONSUMER_NOTIFICATIONS.map(n => {
                const IconComp = n.type === "booking" ? Calendar : n.type === "remind" ? Clock : n.type === "review" ? Star : Bell;
                const handleClick = () => {
                  if (!n.action) return;
                  if (n.action.reviewTarget) { setReviewTarget(n.action.reviewTarget); setReviewRating(5); setReviewText(""); }
                  if (n.action.tab) setTab(n.action.tab);
                  navigate(n.action.screen);
                };
                return (
                  <button key={n.id} onClick={handleClick}
                    className={`flex gap-3 py-3.5 border-b border-gray-50 w-full text-left ${n.read ? "opacity-60" : ""} ${n.action ? "hover:bg-gray-50 cursor-pointer" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                      <IconComp size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
                    {n.action && <span className="text-gray-300 text-xs mt-2 shrink-0">›</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Tab — IA: 홈/카테고리/마이페이지 */}
        {showHeader && (
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 flex items-center z-10">
            {[
              { key: "home" as Tab, Icon: Home, label: "홈", s: "home" as Screen },
              { key: "category" as Tab, Icon: LayoutGrid, label: "카테고리", s: "category" as Screen },
              { key: "mypage" as Tab, Icon: User, label: "MY", s: "mypage" as Screen },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setScreen(t.s); }}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${tab === t.key ? "text-primary" : "text-gray-400"}`}>
                <t.Icon size={20} strokeWidth={1.5} />
                <span className="text-[10px]">{t.label}</span>
              </button>
            ))}
          </div>
        )}

        {deleteRequestIdx !== null && (
          <div className="absolute inset-0 z-30 flex items-end bg-black/45">
            <div className="w-full rounded-t-3xl bg-white p-5 pb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold">리뷰 삭제 요청</h3>
                <button onClick={() => { setDeleteRequestIdx(null); setDeleteRequestReason(""); }} className="text-sm text-gray-400">닫기</button>
              </div>
              <div className="mb-4 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-bold">{MY_REVIEWS_DATA[deleteRequestIdx].studio}</p>
                <p className="mt-1 text-[11px] text-gray-400">삭제는 바로 처리되지 않고, 사유 확인 후 어드민 승인으로 진행됩니다.</p>
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">삭제 요청 사유</label>
                <textarea value={deleteRequestReason} onChange={e => setDeleteRequestReason(e.target.value)} placeholder="삭제를 요청하는 이유를 입력해주세요" className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-primary" rows={4} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setDeleteRequestIdx(null); setDeleteRequestReason(""); }} className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-600">취소</button>
                <button onClick={() => { setDeleteRequestIdx(null); setDeleteRequestReason(""); }} disabled={!deleteRequestReason.trim()} className={`flex-1 rounded-xl py-3 text-sm font-bold ${deleteRequestReason.trim() ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>삭제 요청 제출</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
