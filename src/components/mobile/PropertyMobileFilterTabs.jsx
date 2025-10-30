import { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { useBuilding } from '../../context/BuildingContext';
import { locations, types } from '../../data/mockData';

export function PropertyMobileFilterTabs() {
  const { selectedLocation, selectedType, changeLocationFilter, changeTypeFilter, selectedBuildingId, changeSelectedBuilding } = useProperty();
  const { buildings } = useBuilding();
  const [showBuildingFilter, setShowBuildingFilter] = useState(false);

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

      {/* 건물 필터 */}
      <div className="mt-2">
        <button
          onClick={() => setShowBuildingFilter(!showBuildingFilter)}
          className="w-full px-3 py-2 bg-amber-600 text-white rounded font-bold text-xs hover:bg-amber-700 transition-colors flex justify-between items-center border-4 border-black"
        >
          <span>🏢 건물: {selectedBuildingId ? buildings.find(b => b.id === selectedBuildingId)?.name || '선택됨' : '모두'}</span>
          <span>{showBuildingFilter ? '▼' : '▶'}</span>
        </button>

        {showBuildingFilter && (
          <div className="mt-2 bg-gray-700 rounded border-2 border-amber-600 max-h-40 overflow-y-auto">
            <label className="flex items-center gap-2 p-2 hover:bg-gray-600 cursor-pointer border-b border-amber-600 text-white">
              <input
                type="radio"
                checked={!selectedBuildingId}
                onChange={() => {
                  changeSelectedBuilding(null);
                  setShowBuildingFilter(false);
                }}
                className="w-3 h-3"
              />
              <span className="text-xs">모든 건물</span>
            </label>
            {buildings.map((building) => (
              <label key={building.id} className="flex items-center gap-2 p-2 hover:bg-gray-600 cursor-pointer border-b border-amber-600 last:border-b-0 text-white">
                <input
                  type="radio"
                  checked={selectedBuildingId === building.id}
                  onChange={() => {
                    changeSelectedBuilding(building.id);
                    setShowBuildingFilter(false);
                  }}
                  className="w-3 h-3"
                />
                <span className="text-xs">{building.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
