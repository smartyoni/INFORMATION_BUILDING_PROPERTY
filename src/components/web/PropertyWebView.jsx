import { useState } from 'react';
import { Header } from '../common/Header';
import { PropertyWebSidebar } from './PropertyWebSidebar';
import { PropertyTable } from './PropertyTable';
import { PropertyDetailPanel } from './PropertyDetailPanel';
import { EditPropertyModal } from '../modals/EditPropertyModal';
import { AddPropertyModal } from '../modals/AddPropertyModal';
import { ImportCSVModal } from '../modals/ImportCSVModal';
import { BackupRestoreModal } from '../modals/BackupRestoreModal';
import { useProperty } from '../../context/PropertyContext';

export function PropertyWebView({ onTabChange }) {
  const { deleteProperty } = useProperty();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-50">
      <Header
        currentTab="properties"
        onTabChange={onTabChange}
        onCSVClick={() => setShowImportCSV(true)}
        onBackupClick={() => setShowBackup(true)}
        onRestoreClick={() => setShowRestore(true)}
      />

      <div className="flex gap-0">
        {/* 좌측 사이드바 */}
        <PropertyWebSidebar />

        {/* 중앙 테이블 */}
        <PropertyTable
          onSelectProperty={setSelectedProperty}
          onEditProperty={setEditingProperty}
          onDeleteProperty={handleDeleteProperty}
        />

        {/* 우측 상세 패널 */}
        <PropertyDetailPanel
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onEdit={setEditingProperty}
          onDelete={handleDeleteProperty}
        />
      </div>

      {/* 편집 모달 */}
      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}

      {/* CSV 임포트 모달 */}
      {showImportCSV && (
        <ImportCSVModal onClose={() => setShowImportCSV(false)} mode="properties" />
      )}

      {/* 백업/복원 모달 */}
      {showBackup && (
        <BackupRestoreModal onClose={() => setShowBackup(false)} mode="backup" dataType="properties" />
      )}
      {showRestore && (
        <BackupRestoreModal onClose={() => setShowRestore(false)} mode="restore" dataType="properties" />
      )}
    </div>
  );
}
