import { useBuilding } from '../../context/BuildingContext';

export function WebTable({ onSelectBuilding, onEditBuilding, onDeleteBuilding }) {
  const { filteredBuildings, isLoading } = useBuilding();

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="maple-frame">
        {isLoading && (
          <div className="text-amber-300 text-center py-8">로딩 중...</div>
        )}
        {!isLoading && filteredBuildings.length === 0 && (
          <div className="text-amber-300 text-center py-8">등록된 건물이 없습니다</div>
        )}
        {!isLoading && filteredBuildings.length > 0 && (
          <table className="maple-table">
            <thead>
              <tr>
                <th>건물명</th>
                <th>주소</th>
                <th>승인일</th>
                <th>층수</th>
                <th>주차</th>
                <th>세대</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuildings.map((building) => (
                <tr
                  key={building.id}
                  className="hover:bg-amber-600/20 transition-colors cursor-pointer"
                  onClick={() => onSelectBuilding(building)}
                >
                  <td className="font-bold max-w-[10%]">{building.icon} {building.name}</td>
                  <td className="max-w-[10%]">{building.address}</td>
                  <td>{building.approvalDate}</td>
                  <td className="text-center">{building.floors}</td>
                  <td className="text-center">{building.parking}대</td>
                  <td className="text-center">{building.households || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditBuilding(building);
                        }}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-bold"
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBuilding(building);
                        }}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-bold"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
