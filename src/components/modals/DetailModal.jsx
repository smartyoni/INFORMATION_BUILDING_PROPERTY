import { useState, useRef } from 'react';
import { MapleButton } from '../common/MapleFrame';
import { useBuilding } from '../../context/BuildingContext';

export function DetailModal({ building, onClose, onEdit, onDelete }) {
  const { deleteBuilding, updateBuilding } = useBuilding();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [editingMemoValue, setEditingMemoValue] = useState(building?.memo || '');
  const textareaRef = useRef(null);
  const doubleClickRef = useRef({ count: 0, timeout: null });

  const handleDelete = async () => {
    if (onDelete) {
      // 외부에서 전달된 onDelete 콜백 사용
      onDelete(building);
    } else {
      // 폴백: 이전 동작 유지
      if (window.confirm('정말 삭제하시겠습니까?')) {
        try {
          setIsDeleting(true);
          await deleteBuilding(building.id);
          onClose();
        } catch (err) {
          alert('삭제에 실패했습니다: ' + err.message);
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

  const handleMemoTouchStart = () => {
    doubleClickRef.current.count++;
    if (doubleClickRef.current.timeout) {
      clearTimeout(doubleClickRef.current.timeout);
    }

    doubleClickRef.current.timeout = setTimeout(() => {
      doubleClickRef.current.count = 0;
    }, 300);

    if (doubleClickRef.current.count === 2) {
      doubleClickRef.current.count = 0;
      handleMemoDoubleClick();
    }
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="maple-header flex-grow text-center">{building.name}</h2>
          <button
            onClick={onClose}
            className="text-amber-700 font-bold text-xl hover:text-amber-900 ml-2"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* 통합 정보 */}
          <div className="bg-white/20 p-3 rounded text-sm text-amber-900">
            <div className="mb-2"><span className="font-bold">주소:</span> {building.address}</div>
            <div className="mb-2"><span className="font-bold">승인일:</span> {building.approvalDate}</div>
            <div className="mb-2"><span className="font-bold">층수:</span> {building.floors}</div>
            <div className="mb-2"><span className="font-bold">주차:</span> {building.parking}</div>
            <div><span className="font-bold">세대:</span> {building.households || 0}</div>
          </div>

          {/* 메모 */}
          {isEditingMemo ? (
            <div className="bg-white/20 p-3 rounded space-y-2">
              <textarea
                ref={textareaRef}
                value={editingMemoValue}
                onChange={(e) => setEditingMemoValue(e.target.value)}
                onBlur={handleSaveMemo}
                className="w-full h-20 bg-white/10 border-2 border-amber-600 rounded p-2 text-amber-900 text-sm focus:outline-none focus:border-amber-400 resize-none"
                placeholder="메모를 입력하세요"
              />
              <div className="flex gap-2 text-xs">
                <button
                  onClick={handleSaveMemo}
                  className="flex-1 px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelMemo}
                  className="flex-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 p-3 rounded">
              <h3 className="font-bold text-amber-900 mb-2">메모</h3>
              <p
                onDoubleClick={handleMemoDoubleClick}
                onTouchStart={handleMemoTouchStart}
                className="text-amber-800 text-sm whitespace-pre-wrap break-words cursor-text hover:opacity-75"
              >
                {building.memo || '메모가 없습니다. 더블클릭 또는 연속 터치하여 추가하세요.'}
              </p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton
              className="flex-1"
              onClick={handleEdit}
            >
              수정
            </MapleButton>
            <MapleButton
              className="flex-1"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제중...' : '삭제'}
            </MapleButton>
            <MapleButton
              className="flex-1"
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
