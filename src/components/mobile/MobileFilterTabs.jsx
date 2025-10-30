import { useBuilding } from '../../context/BuildingContext';
import { MapleTab } from '../common/MapleFrame';
import { locations, types } from '../../data/mockData';

export function MobileFilterTabs() {
  const { selectedLocation, selectedType, changeLocationFilter, changeTypeFilter } = useBuilding();

  return (
    <div className="px-4 py-3 bg-gradient-to-b from-gray-800 to-gray-900 border-b-4 border-amber-700 space-y-1">
      {/* 유형 필터 - 가로 스크롤 */}
      <div className="flex overflow-x-auto pb-1 scrollbar-thin">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => changeTypeFilter(type.value)}
            className={`text-xs py-1 px-1 whitespace-nowrap flex-shrink-0 rounded transition-all border-4 border-black ${
              selectedType === type.value
                ? 'bg-green-400 text-black font-bold shadow-lg shadow-green-300'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 위치 필터 - 가로 스크롤 */}
      <div className="flex overflow-x-auto pb-1 scrollbar-thin">
        {locations.map((loc) => (
          <button
            key={loc.value}
            onClick={() => changeLocationFilter(loc.value)}
            className={`text-xs py-1 px-1 whitespace-nowrap flex-shrink-0 rounded transition-all border-4 border-black ${
              selectedLocation === loc.value
                ? 'bg-orange-300 text-black font-bold shadow-lg shadow-orange-200'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
