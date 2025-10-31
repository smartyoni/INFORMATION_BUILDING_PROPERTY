import { useState } from 'react';
import { Header } from '../common/Header';
import { MobileFilterTabs } from './MobileFilterTabs';
import { MobileBottomNav } from './MobileBottomNav';
import { DetailModal } from '../modals/DetailModal';
import { AddBuildingModal } from '../modals/AddBuildingModal';
import { EditBuildingModal } from '../modals/EditBuildingModal';
import { ImportCSVModal } from '../modals/ImportCSVModal';
import { BackupRestoreModal } from '../modals/BackupRestoreModal';
import { useBuilding } from '../../context/BuildingContext';

export function MobileView({ onTabChange }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const { filteredBuildings, isLoading, deleteBuilding } = useBuilding();

  const handleNavAction = (action) => {
    if (action === 'add') setShowAddBuilding(true);
    if (action === 'import') setShowImportCSV(true);
    if (action === 'backup') setShowBackup(true);
    if (action === 'restore') setShowRestore(true);
  };

  const handleDeleteBuilding = async (building) => {
    if (confirm(`"${building.name}"을(를) 삭제하시겠습니까?`)) {
      try {
        await deleteBuilding(building.id);
        setSelectedBuilding(null);
      } catch (err) {
        console.error('삭제 실패:', err);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-amber-100 to-amber-50">
      <Header
        currentTab="buildings"
        onCSVClick={() => setShowImportCSV(true)}
        onBackupClick={() => setShowBackup(true)}
        onRestoreClick={() => setShowRestore(true)}
      />
      <MobileFilterTabs />

      {/* 건물 목록 - 테이블 뷰 */}
      <div className="p-4">
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
                  <th>지번</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuildings.map((building) => (
                  <tr
                    key={building.id}
                    className="hover:bg-amber-600/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedBuilding(building)}
                  >
                    <td className="font-bold">{building.icon} {building.name}</td>
                    <td>{building.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={() => setShowAddBuilding(true)}
        className="maple-fab fixed bottom-20 right-6 hover:scale-110 transition-transform"
      >
        ➕
      </button>

      {/* 하단 네비게이션 */}
      <MobileBottomNav
        onAction={handleNavAction}
        currentTab="buildings"
        onTabChange={onTabChange}
      />

      {/* 상세 모달 */}
      {selectedBuilding && (
        <DetailModal
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onEdit={setEditingBuilding}
          onDelete={handleDeleteBuilding}
        />
      )}

      {/* 추가 모달 */}
      {showAddBuilding && (
        <AddBuildingModal onClose={() => setShowAddBuilding(false)} />
      )}

      {/* 편집 모달 */}
      {editingBuilding && (
        <EditBuildingModal
          building={editingBuilding}
          onClose={() => setEditingBuilding(null)}
        />
      )}

      {/* 기타 모달들 */}
      {showImportCSV && (
        <ImportCSVModal onClose={() => setShowImportCSV(false)} />
      )}
      {showBackup && (
        <BackupRestoreModal onClose={() => setShowBackup(false)} mode="backup" />
      )}
      {showRestore && (
        <BackupRestoreModal onClose={() => setShowRestore(false)} mode="restore" />
      )}
    </div>
  );
}
