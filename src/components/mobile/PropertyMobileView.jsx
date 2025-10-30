import { useState } from 'react';
import { Header } from '../common/Header';
import { PropertyMobileFilterTabs } from './PropertyMobileFilterTabs';
import { MobileBottomNav } from './MobileBottomNav';
import { PropertyDetailModal } from '../modals/PropertyDetailModal';
import { AddPropertyModal } from '../modals/AddPropertyModal';
import { EditPropertyModal } from '../modals/EditPropertyModal';
import { ImportCSVModal } from '../modals/ImportCSVModal';
import { BackupRestoreModal } from '../modals/BackupRestoreModal';
import { useProperty } from '../../context/PropertyContext';

export function PropertyMobileView({ onTabChange }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const { filteredProperties, isLoading, deleteProperty } = useProperty();

  const handleNavAction = (action) => {
    if (action === 'add') setShowAddProperty(true);
    if (action === 'import') setShowImportCSV(true);
    if (action === 'backup') setShowBackup(true);
    if (action === 'restore') setShowRestore(true);
  };

  const handleDeleteProperty = async (property) => {
    if (confirm(`"${property.propertyName}"을(를) 삭제하시겠습니까?`)) {
      try {
        await deleteProperty(property.id);
        setSelectedProperty(null);
      } catch (err) {
        console.error('삭제 실패:', err);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-amber-100 to-amber-50">
      <Header
        currentTab="properties"
        onTabChange={onTabChange}
        onCSVClick={() => setShowImportCSV(true)}
        onBackupClick={() => setShowBackup(true)}
        onRestoreClick={() => setShowRestore(true)}
      />
      <PropertyMobileFilterTabs />

      {/* 매물 목록 - 테이블 뷰 */}
      <div className="p-4">
        <div className="maple-frame">
          <div className="maple-header">매물 목록 - {filteredProperties.length}개</div>

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
                    onClick={() => setSelectedProperty(property)}
                  >
                    <td className="font-bold">{property.propertyName}</td>
                    <td>{property.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={() => setShowAddProperty(true)}
        className="maple-fab fixed bottom-20 right-6 hover:scale-110 transition-transform"
      >
        ➕
      </button>

      {/* 하단 네비게이션 */}
      <MobileBottomNav onAction={handleNavAction} />

      {/* 상세 모달 */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onEdit={setEditingProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* 추가 모달 */}
      {showAddProperty && (
        <AddPropertyModal onClose={() => setShowAddProperty(false)} />
      )}

      {/* 편집 모달 */}
      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}

      {/* 기타 모달들 */}
      {showImportCSV && (
        <ImportCSVModal onClose={() => setShowImportCSV(false)} mode="properties" />
      )}
      {showBackup && (
        <BackupRestoreModal onClose={() => setShowBackup(false)} mode="backup" dataType="properties" />
      )}
      {showRestore && (
        <BackupRestoreModal onClose={() => setShowRestore(false)} mode="restore" dataType="properties" />
      )}
    </div>
  );
}
