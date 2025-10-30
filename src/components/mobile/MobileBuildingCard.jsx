import { MapleCard } from '../common/MapleFrame';

export function MobileBuildingCard({ building, onSelect }) {
  return (
    <MapleCard onClick={() => onSelect(building)}>
      <div className="flex gap-3">
        {/* 아이콘 */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-700 border-2 border-amber-900 rounded flex items-center justify-center text-2xl">
            {building.icon}
          </div>
        </div>

        {/* 정보 */}
        <div className="flex-grow">
          <h3 className="font-bold text-amber-900 text-lg">{building.name}</h3>
          <p className="text-sm text-gray-700">📍 {building.address}</p>
          <p className="text-xs text-gray-600">승인: {building.approvalDate}</p>

          <div className="mt-2 grid grid-cols-3 gap-2 bg-white/30 p-2 rounded">
            <div className="text-center">
              <div className="text-xs text-gray-700">층</div>
              <div className="font-bold text-amber-900">{building.floors}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-700">주차</div>
              <div className="font-bold text-amber-900">{building.parking}대</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-700">세대</div>
              <div className="font-bold text-amber-900">{building.households || '-'}</div>
            </div>
          </div>

          <div className="mt-2 flex gap-2">
            <span className="text-xs bg-amber-700 text-white px-2 py-1 rounded">
              {building.location}
            </span>
            <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded">
              {building.type}
            </span>
          </div>
        </div>
      </div>
    </MapleCard>
  );
}
