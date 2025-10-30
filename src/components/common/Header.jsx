import { useBuilding } from '../../context/BuildingContext';

export function Header({ currentTab = 'buildings', onTabChange, onCSVClick, onBackupClick, onRestoreClick }) {
  const { searchQuery, changeSearchQuery } = useBuilding();

  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-b-4 border-amber-700 p-4 text-amber-900">
      {/* 1줄: 탭 네비게이션 */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => onTabChange?.('buildings')}
          className={`px-4 py-2 text-lg font-bold transition-all ${
            currentTab === 'buildings'
              ? 'bg-amber-400 text-amber-900 border-b-4 border-amber-700'
              : 'text-amber-700 hover:bg-amber-200/50'
          }`}
        >
          건물정보
        </button>
        <button
          onClick={() => onTabChange?.('properties')}
          className={`px-4 py-2 text-lg font-bold transition-all ${
            currentTab === 'properties'
              ? 'bg-amber-400 text-amber-900 border-b-4 border-amber-700'
              : 'text-amber-700 hover:bg-amber-200/50'
          }`}
        >
          매물장
        </button>
      </div>

      {/* 2줄: 검색창 + 버튼 */}
      <div className="flex gap-2">
        {/* 검색창 */}
        <input
          type="text"
          placeholder="건물명 검색..."
          value={searchQuery}
          onChange={(e) => changeSearchQuery(e.target.value)}
          className="flex-1 bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
        />

        {/* CSV 버튼 */}
        <button
          onClick={onCSVClick}
          className="maple-button px-3 py-2 text-sm whitespace-nowrap hover:bg-amber-600 transition-colors"
        >
          CSV
        </button>

        {/* 백업 버튼 */}
        <button
          onClick={onBackupClick}
          className="maple-button px-3 py-2 text-sm whitespace-nowrap hover:bg-amber-600 transition-colors"
        >
          백업
        </button>

        {/* 복원 버튼 */}
        <button
          onClick={onRestoreClick}
          className="maple-button px-3 py-2 text-sm whitespace-nowrap hover:bg-amber-600 transition-colors"
        >
          복원
        </button>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-purple-600 to-amber-500 rounded mt-3"></div>
    </div>
  );
}
