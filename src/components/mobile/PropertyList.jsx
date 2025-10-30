import { useProperty } from '../../context/PropertyContext';

export function PropertyList({ onSelectProperty, onEditProperty, onDeleteProperty }) {
  const { filteredProperties, isLoading } = useProperty();

  return (
    <div className="p-4">
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
                <th>매물명</th>
                <th>구분</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-amber-600/20 transition-colors cursor-pointer"
                  onClick={() => onSelectProperty(property)}
                >
                  <td className="font-bold max-w-[60%]">{property.propertyName}</td>
                  <td className="text-center">{property.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
