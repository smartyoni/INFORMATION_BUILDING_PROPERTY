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

## UI 디자인 가이드라인

### 1. 모달 규격 표준화

**모든 모달의 기본 너비:**
- **데스크톱**: `max-width: 45%`
- **모바일 (768px 이하)**: `max-width: 95%`
- **높이**: `max-height: calc(90vh - 40px)`, `overflow-y: auto`

**적용 방법:**
```jsx
// 방법 1: CSS 클래스 (권장)
<div className="maple-modal w-full my-4">
  {/* 내용 */}
</div>

// 방법 2: 인라인 스타일 (특수한 경우만)
<div style={{ maxWidth: '45%', maxHeight: 'calc(90vh - 40px)' }}>
  {/* 내용 */}
</div>
```

### 2. 모달 구조 (Header + Content + Footer)

**표준 헤더 패턴:**
```jsx
<div className="maple-header mb-4">
  📥 CSV 파일 임포트
</div>
```

**표준 콘텐츠 영역:**
```jsx
<div className="space-y-3 max-h-96 overflow-y-auto px-4">
  {/* 폼 필드들 */}
</div>
```

**표준 푸터 (버튼):**
- **일반 모달 (추가/수정)**: 가로 배치 (flex-row)
  ```jsx
  <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
    <MapleButton className="flex-1">추가</MapleButton>
    <MapleButton className="flex-1">취소</MapleButton>
  </div>
  ```

- **상세보기 모달**: 세로 배치 (space-y-2)
  ```jsx
  <div className="pt-4 border-t-2 border-amber-700 space-y-2">
    <MapleButton className="w-full text-sm">✏️ 수정</MapleButton>
    <MapleButton className="w-full text-sm">🗑️ 삭제</MapleButton>
    <MapleButton className="w-full text-sm">닫기</MapleButton>
  </div>
  ```

### 3. 폼 필드 스타일 표준화

**입력 필드 (Input/Textarea/Select):**
```jsx
className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2
           text-amber-100 placeholder-amber-400 focus:outline-none
           focus:border-amber-500 text-sm"
```

**라벨:**
```jsx
className="block text-amber-300 font-bold text-sm mb-1"
```

**2단 레이아웃 (예: 지번 + 사용승인일):**
```jsx
<div className="flex gap-2">
  <div className="flex-1">
    <label className="block text-amber-300 font-bold text-sm mb-1">지번</label>
    <input className="..." />
  </div>
  <div className="flex-1">
    <label className="block text-amber-300 font-bold text-sm mb-1">사용승인일</label>
    <input className="..." />
  </div>
</div>
```

### 4. 색상 팔레트 (메이플 테마)

| 용도 | 색상 | Tailwind Class |
|------|------|-----------------|
| 헤더 배경 | 그라디언트 | `linear-gradient(90deg, #8B5FB5 0%, #D4AF37 50%, #8B5FB5 100%)` |
| 모달 배경 | 밝은 베이지 | `linear-gradient(135deg, #D4C4A8 0%, #C9B896 100%)` |
| 주요 텍스트 | 황금색 | `text-amber-300` |
| 부수 텍스트 | 밝은 황색 | `text-amber-100`, `text-amber-200` |
| 보조 텍스트 | 어두운 황색 | `text-amber-800`, `text-amber-900` |
| 입력 필드 배경 | 반투명 | `bg-white/20` |
| 테두리 | 진한 황색 | `border-amber-700` (2px) |
| 포커스 테두리 | 밝은 황색 | `focus:border-amber-500` |
| 에러 메시지 | 빨간색 | `text-red-300` |
| 성공 메시지 | 녹색 | `text-green-300` |

### 5. 간격 및 여백 규칙

| 요소 | 크기 | Tailwind Class |
|------|------|-----------------|
| 섹션 간격 | 12px | `space-y-3` |
| 필드 간격 | 8px | `gap-2` |
| 라벨 아래 여백 | 4px | `mb-1` |
| 푸터 위 여백 | 16px | `pt-4` |
| 좌우 패딩 | 16px | `px-4` |

### 6. 기본 모달 템플릿

```jsx
import React, { useState } from 'react';
import MapleButton from '../common/MapleButton';

export default function TemplateModal({ isOpen, onClose, onSubmit }) {
  const [data, setData] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="maple-modal w-full my-4">
        {/* 헤더 */}
        <div className="maple-header mb-4">
          ➕ 항목 추가
        </div>

        {/* 콘텐츠 */}
        <div className="space-y-3 max-h-96 overflow-y-auto px-4">
          <div>
            <label className="block text-amber-300 font-bold text-sm mb-1">
              필드명
            </label>
            <input
              type="text"
              name="fieldName"
              value={data.fieldName || ''}
              onChange={handleChange}
              className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2
                         text-amber-100 placeholder-amber-400 focus:outline-none
                         focus:border-amber-500 text-sm"
              placeholder="입력하세요"
            />
          </div>
        </div>

        {/* 푸터 (일반 모달용) */}
        <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
          <MapleButton className="flex-1" onClick={handleSubmit}>
            추가
          </MapleButton>
          <MapleButton className="flex-1" onClick={onClose}>
            취소
          </MapleButton>
        </div>
      </div>
    </div>
  );
}
```

### 7. 반응형 디자인 원칙

**모바일 전용 스타일 (768px 이하):**
- 모달 너비: `95%`
- 2단 레이아웃 → 1단 레이아웃으로 변환
- 버튼 높이 증가
- 폰트 크기 유지

**구현 예시 (Tailwind):**
```jsx
<div className="md:w-2/5 w-11/12"> {/* 모바일: 95%, 데스크톱: 45% */}
  {/* 내용 */}
</div>
```

### 8. 중요 주의사항

⚠️ **일관성 체크리스트:**
- [ ] 모든 모달이 `max-width: 45%` (또는 데스크톱 기준 일정한 너비)
- [ ] 모든 입력 필드가 동일한 스타일 사용
- [ ] 헤더가 `maple-header` 클래스 적용
- [ ] 푸터가 `border-t-2 border-amber-700` 사용
- [ ] MapleButton 컴포넌트 사용 (표준 스타일링)
- [ ] 모바일 반응형 대응 (768px 이하)

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
