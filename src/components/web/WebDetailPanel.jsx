import { useState, useRef } from 'react';
import { MapleButton } from '../common/MapleFrame';
import { useBuilding } from '../../context/BuildingContext';

export function WebDetailPanel({ building, onClose, onEdit, onDelete }) {
  const { deleteBuilding, updateBuilding } = useBuilding();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [editingMemoValue, setEditingMemoValue] = useState(building?.memo || '');
  const textareaRef = useRef(null);

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(building);
    } else {
      if (confirm(`"${building.name}"을(를) 삭제하시겠습니까?`)) {
        try {
          setIsDeleting(true);
          await deleteBuilding(building.id);
          onClose();
        } catch (err) {
          console.error('삭제 실패:', err);
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(building);
    }
  };

  const handleMemoDoubleClick = () => {
    setIsEditingMemo(true);
    setEditingMemoValue(building.memo || '');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSaveMemo = async () => {
    try {
      await updateBuilding({
        ...building,
        memo: editingMemoValue.trim()
      });
      setIsEditingMemo(false);
    } catch (err) {
      console.error('메모 저장 실패:', err);
    }
  };

  const handleCancelMemo = () => {
    setIsEditingMemo(false);
  };

  const handleMemoKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveMemo();
    }
  };
  if (!building) {
    return (
      <div className="w-96 bg-gradient-to-b from-amber-100 to-amber-50 border-l-4 border-amber-700 p-6 flex items-center justify-center">
        <p className="text-amber-900 text-center">건물을 선택하면 상세정보가 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="w-96 bg-gradient-to-b from-amber-100 to-amber-50 border-l-4 border-amber-700 p-6 overflow-y-auto h-screen">
      <div className="maple-frame">
        {/* 헤더 */}
        <div className="maple-header mb-4">
          {building.icon} {building.name}
        </div>

        <div className="p-4 space-y-4">
          {/* 기본 정보 */}
          <div className="bg-white/10 p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-amber-300">주소</span>
              <span className="text-amber-100 text-sm">{building.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-amber-300">승인일</span>
              <span className="text-amber-100 text-sm">{building.approvalDate}</span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-white/10 p-3 rounded">
            <h4 className="font-bold text-amber-300 mb-3">📊 상세 정보</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-200">층수</span>
                <span className="font-bold text-amber-100">{building.floors}층</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">주차대수</span>
                <span className="font-bold text-amber-100">{building.parking}대</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">세대수</span>
                <span className="font-bold text-amber-100">{building.households || 0}호</span>
              </div>
            </div>
          </div>

          {/* 메모 입력창 */}
          <div className="bg-white/10 p-3 rounded">
            {isEditingMemo ? (
              <div className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={editingMemoValue}
                  onChange={(e) => setEditingMemoValue(e.target.value)}
                  onBlur={handleSaveMemo}
                  onKeyDown={handleMemoKeyDown}
                  className="w-full h-48 bg-white/20 border-2 border-amber-400 rounded p-2 text-amber-100 text-sm focus:outline-none focus:border-amber-300 resize-none"
                  placeholder="메모를 입력하세요"
                />
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={handleSaveMemo}
                    className="px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelMemo}
                    className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                value={building.memo || ''}
                readOnly
                onDoubleClick={handleMemoDoubleClick}
                className="w-full h-48 bg-white/20 border-2 border-amber-700 rounded p-2 text-amber-100 text-sm focus:outline-none resize-none cursor-text hover:bg-white/30 transition-colors"
                placeholder="더블클릭하면 메모를 편집할 수 있습니다"
              />
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="pt-4 border-t-2 border-amber-700 space-y-2">
            <MapleButton
              className="w-full"
              onClick={handleEdit}
            >
              ✏️ 수정
            </MapleButton>
            <MapleButton
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
            </MapleButton>
            <MapleButton
              className="w-full"
              onClick={onClose}
            >
              닫기
            </MapleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
