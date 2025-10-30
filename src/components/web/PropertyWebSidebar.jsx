import { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { useBuilding } from '../../context/BuildingContext';
import { MapleButton, MapleDivider } from '../common/MapleFrame';
import { AddPropertyModal } from '../modals/AddPropertyModal';
import { locations, types } from '../../data/mockData';

export function PropertyWebSidebar() {
  const { selectedLocation, selectedType, changeLocationFilter, changeTypeFilter, selectedBuildingId, changeSelectedBuilding } = useProperty();
  const { buildings } = useBuilding();
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showBuildingFilter, setShowBuildingFilter] = useState(false);

  return (
    <div className="w-64 bg-gradient-to-b from-amber-100 to-amber-50 border-r-4 border-amber-700 p-4 h-screen overflow-y-auto">
      {/* 필터 섹션 */}
      <div className="maple-frame mb-6">
        <div className="maple-header">🔍 필터</div>
        <div className="p-4 space-y-4">
          {/* 건물 필터 */}
          <div>
            <div className="flex justify-between items-center cursor-pointer p-2 hover:bg-white/10 rounded" onClick={() => setShowBuildingFilter(!showBuildingFilter)}>
              <h4 className="text-amber-300 font-bold text-sm">🏢 건물</h4>
              <span className="text-amber-300">{showBuildingFilter ? '▼' : '▶'}</span>
            </div>
            {showBuildingFilter && (
              <div className="mt-2 space-y-1 text-xs max-h-40 overflow-y-auto">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/10 rounded">
                  <input
                    type="radio"
                    checked={!selectedBuildingId}
                    onChange={() => changeSelectedBuilding(null)}
                    className="w-3 h-3"
                  />
                  <span className="text-amber-100">모든 건물</span>
                </label>
                {buildings.map((building) => (
                  <label key={building.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/10 rounded">
                    <input
                      type="radio"
                      checked={selectedBuildingId === building.id}
                      onChange={() => changeSelectedBuilding(building.id)}
                      className="w-3 h-3"
                    />
                    <span className="text-amber-100">{building.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <MapleDivider />

          {/* 위치 필터 */}
          <div>
            <h4 className="text-amber-300 font-bold mb-3 text-sm">📍 위치</h4>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => (
                <label
                  key={loc.value}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/10 rounded text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocation === loc.value}
                    onChange={() => changeLocationFilter(loc.value)}
                    className="w-3 h-3"
                  />
                  <span className="text-amber-100">{loc.label}</span>
                </label>
              ))}
            </div>
          </div>

          <MapleDivider />

          {/* 유형 필터 */}
          <div>
            <h4 className="text-amber-300 font-bold mb-3 text-sm">🏢 유형</h4>
            <div className="grid grid-cols-2 gap-2">
              {types.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/10 rounded text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedType === type.value}
                    onChange={() => changeTypeFilter(type.value)}
                    className="w-3 h-3"
                  />
                  <span className="text-amber-100">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-2">
        <MapleButton className="w-full text-sm" onClick={() => setShowAddProperty(true)}>
          ➕ 매물 추가
        </MapleButton>
      </div>

      {/* 모달들 */}
      {showAddProperty && (
        <AddPropertyModal onClose={() => setShowAddProperty(false)} />
      )}
    </div>
  );
}
