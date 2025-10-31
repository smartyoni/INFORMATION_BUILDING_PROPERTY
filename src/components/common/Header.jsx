import { useBuilding } from '../../context/BuildingContext';
import { useProperty } from '../../context/PropertyContext';

export function Header({ currentTab = 'buildings', onCSVClick, onBackupClick, onRestoreClick }) {
  const { searchQuery, changeSearchQuery } = useBuilding();
  const { searchQuery: propertySearchQuery, changeSearchQuery: changePropertySearchQuery } = useProperty();

  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-b-4 border-amber-700 p-4 text-amber-900">
      {/* 검색창 + 버튼 */}
      <div className="flex gap-2">
        {/* 검색창 */}
        <input
          type="text"
          placeholder={currentTab === 'buildings' ? '건물명 검색...' : '매물명 검색...'}
          value={currentTab === 'buildings' ? searchQuery : propertySearchQuery}
          onChange={(e) => {
            if (currentTab === 'buildings') {
              changeSearchQuery(e.target.value);
            } else {
              changePropertySearchQuery(e.target.value);
            }
          }}
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
    </div>
  );
}
