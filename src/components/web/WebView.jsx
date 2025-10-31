import { useState } from 'react';
import { Header } from '../common/Header';
import { WebSidebar } from './WebSidebar';
import { WebTable } from './WebTable';
import { WebDetailPanel } from './WebDetailPanel';
import { MobileBottomNav } from '../mobile/MobileBottomNav';
import { EditBuildingModal } from '../modals/EditBuildingModal';
import { ImportCSVModal } from '../modals/ImportCSVModal';
import { BackupRestoreModal } from '../modals/BackupRestoreModal';
import { useBuilding } from '../../context/BuildingContext';

export function WebView({ onTabChange }) {
  const { deleteBuilding } = useBuilding();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

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

  const handleNavAction = (action) => {
    if (action === 'import') setShowImportCSV(true);
    if (action === 'backup') setShowBackup(true);
    if (action === 'restore') setShowRestore(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-50 pb-24">
      <Header
        currentTab="buildings"
        onCSVClick={() => setShowImportCSV(true)}
        onBackupClick={() => setShowBackup(true)}
        onRestoreClick={() => setShowRestore(true)}
      />

      <div className="flex gap-0">
        {/* 좌측 사이드바 */}
        <WebSidebar />

        {/* 중앙 테이블 */}
        <WebTable
          onSelectBuilding={setSelectedBuilding}
          onEditBuilding={setEditingBuilding}
          onDeleteBuilding={handleDeleteBuilding}
        />

        {/* 우측 상세 패널 */}
        <WebDetailPanel
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onEdit={setEditingBuilding}
          onDelete={handleDeleteBuilding}
        />
      </div>

      {/* 편집 모달 */}
      {editingBuilding && (
        <EditBuildingModal
          building={editingBuilding}
          onClose={() => setEditingBuilding(null)}
        />
      )}

      {/* CSV 임포트 모달 */}
      {showImportCSV && (
        <ImportCSVModal onClose={() => setShowImportCSV(false)} />
      )}

      {/* 백업/복원 모달 */}
      {showBackup && (
        <BackupRestoreModal onClose={() => setShowBackup(false)} mode="backup" />
      )}
      {showRestore && (
        <BackupRestoreModal onClose={() => setShowRestore(false)} mode="restore" />
      )}

      {/* 하단 네비게이션 */}
      <div className="hidden md:block">
        <MobileBottomNav
          onAction={handleNavAction}
          currentTab="buildings"
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
}
