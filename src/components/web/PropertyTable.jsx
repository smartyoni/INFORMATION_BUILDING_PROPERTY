import { useProperty } from '../../context/PropertyContext';

export function PropertyTable({ onSelectProperty, onEditProperty, onDeleteProperty }) {
  const { filteredProperties, isLoading } = useProperty();

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="maple-frame">
        {isLoading && (
          <div className="text-amber-300 text-center py-8">로딩 중...</div>
        )}
        {!isLoading && filteredProperties.length === 0 && (
          <div className="text-amber-300 text-center py-8">등록된 매물이 없습니다</div>
        )}
        {!isLoading && filteredProperties.length > 0 && (
          <table className="maple-table">
            <thead>
              <tr>
                <th>접수일</th>
                <th>구분</th>
                <th>매물명</th>
                <th>금액</th>
                <th>입주일</th>
                <th>소유자</th>
                <th>소유자번호</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-amber-600/20 transition-colors cursor-pointer"
                  onClick={() => onSelectProperty(property)}
                >
                  <td>{property.receivedDate || '-'}</td>
                  <td className="font-bold">{property.category}</td>
                  <td className="max-w-[15%]">{property.propertyName}</td>
                  <td className="text-right">{property.price ? `${property.price.toLocaleString()}원` : '-'}</td>
                  <td>{property.moveInDate || '-'}</td>
                  <td>{property.owner || '-'}</td>
                  <td>{property.ownerPhone || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProperty(property);
                        }}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-bold"
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProperty(property);
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
