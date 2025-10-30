# 건물 매물 관리 애플리케이션 개발 현황

## 프로젝트 개요
React + Vite + Tailwind CSS 기반의 건물 및 매물 관리 웹 애플리케이션

## 완료된 기능

### 1. 건물 관리 (Building Management)
- ✅ 건물 정보 CRUD (Create, Read, Update, Delete)
- ✅ 건물 CSV 임포트 기능
- ✅ 위치, 유형별 필터링
- ✅ IndexedDB 데이터 영속성

### 2. 매물 관리 (Property Listing)
- ✅ 매물 정보 CRUD
- ✅ 매물 CSV 임포트 (상세 로깅 추가)
- ✅ 건물명 + 호실명으로 매물명 자동 생성
- ✅ 위치, 매물유형, 구분별 필터링
- ✅ 건물 선택 필터링
- ✅ 접수일 기준 역순 정렬

### 3. CSV 임포트 기능
**건물 CSV 형식:**
```
건물명,지번,사용승인일,층수,주차대수,세대수,공동현관비번,관리실번호,위치,유형
```

**매물 CSV 형식:**
```
접수일,위치,매물유형,구분,건물명,호실명,금액,입주일,소유자,소유자번호,임대차정보,메모
```

### 4. UI/UX
- ✅ 웹 뷰 (Web): 45% 너비, 1.5배 높이 모달
- ✅ 모바일 뷰: 반응형 디자인
- ✅ 메이플 테마 스타일링
- ✅ 다크 그래디언트 필터 탭
- ✅ 건물명 드롭다운 검색 (흰색 배경)

### 5. 배포
- ✅ GitHub 저장소 초기화 및 커밋
- ✅ GitHub Pages 배포 완료
- 📍 **배포 URL:** https://smartyoni.github.io/INFORMATION_BUILDING_PROPERTY/

## 진행 중인 작업

### CSV 임포트 디버깅
- 🔧 상세 로깅 시스템 추가
- 📍 로그 위치:
  - ImportPropertyCSVModal.jsx (line 48-85)
  - useIndexedDB.js (line 230-267)
  - PropertyContext.jsx (line 158-177)

## 향후 계획

### 1. PWA 구현 (내일 예정)
- [ ] `manifest.json` 생성
- [ ] Service Worker 구현
- [ ] 오프라인 지원
- [ ] 홈 화면 추가 기능
- [ ] 앱 아이콘 및 스플래시 화면

### 2. 추가 기능
- [ ] 데이터 백업/복원
- [ ] 고급 검색 및 필터
- [ ] 데이터 통계
- [ ] 인쇄 기능

## 기술 스택

| 항목 | 버전 |
|------|------|
| React | ^18.2.0 |
| Vite | ^4.5.14 |
| Tailwind CSS | ^3.3.0 |
| IndexedDB | 브라우저 기본 |

## 디렉토리 구조

```
src/
├── components/
│   ├── modals/          # 모달 컴포넌트
│   ├── web/             # 웹 뷰 컴포넌트
│   ├── mobile/          # 모바일 뷰 컴포넌트
│   └── common/          # 공용 컴포넌트
├── context/             # Context API (상태관리)
├── hooks/               # Custom hooks
├── utils/               # 유틸리티 함수
├── data/                # Mock 데이터
└── index.css            # 전역 스타일
```

## 주요 파일 설명

| 파일 | 설명 |
|------|------|
| PropertyContext.jsx | 매물 상태 관리 |
| BuildingContext.jsx | 건물 상태 관리 |
| useIndexedDB.js | IndexedDB 데이터베이스 |
| csvImporter.js | CSV 파싱 및 검증 |
| ImportPropertyCSVModal.jsx | 매물 CSV 임포트 UI |

## 배포 명령어

```bash
# 로컬 개발
npm run dev

# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

## 주의사항

- Windows 환경에서 경로 길이 제한 이슈 해결됨 (node_modules 제외)
- CSV 날짜 형식: YYYY-MM-DD (예: 2024-01-15)
- IndexedDB는 브라우저별 용량 제한 있음 (대역폭 주의)

## 마지막 업데이트
- 날짜: 2025-10-30
- 커밋: GitHub Pages 배포 완료
- 다음 작업: PWA 구현
