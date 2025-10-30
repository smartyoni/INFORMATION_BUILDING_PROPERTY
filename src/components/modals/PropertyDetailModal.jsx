import { useState, useRef } from 'react';
import { MapleButton } from '../common/MapleFrame';
import { useProperty } from '../../context/PropertyContext';

export function PropertyDetailModal({ property, onClose, onEdit, onDelete }) {
  const { deleteProperty, updateProperty } = useProperty();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [editingMemoValue, setEditingMemoValue] = useState(property?.memo || '');
  const textareaRef = useRef(null);

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(property);
    } else {
      if (confirm(`"${property.propertyName}"을(를) 삭제하시겠습니까?`)) {
        try {
          setIsDeleting(true);
          await deleteProperty(property.id);
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
      onEdit(property);
    }
  };

  const handleMemoDoubleClick = () => {
    setIsEditingMemo(true);
    setEditingMemoValue(property.memo || '');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSaveMemo = async () => {
    try {
      await updateProperty({
        ...property,
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg maple-frame my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)', overflowY: 'auto' }}>
        {/* 헤더 */}
        <div className="maple-header sticky top-0 mb-4 flex justify-between items-center">
          <span>{property.propertyName}</span>
          <button
            onClick={onClose}
            className="text-2xl text-amber-700 hover:text-amber-900"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 기본 정보 */}
          <div className="bg-white/10 p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-amber-300">접수일</span>
              <span className="text-amber-100 text-sm">{property.receivedDate || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-amber-300">구분</span>
              <span className="text-amber-100 text-sm">{property.category}</span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-white/10 p-3 rounded">
            <h4 className="font-bold text-amber-300 mb-3 text-sm">📊 상세 정보</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-amber-200">매물명</span>
                <span className="font-bold text-amber-100">{property.propertyName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">금액</span>
                <span className="font-bold text-amber-100">{property.price ? `${property.price.toLocaleString()}원` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">입주일</span>
                <span className="font-bold text-amber-100">{property.moveInDate || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">소유자</span>
                <span className="font-bold text-amber-100">{property.owner || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">소유자번호</span>
                <span className="font-bold text-amber-100">{property.ownerPhone || '-'}</span>
              </div>
            </div>
          </div>

          {/* 임대현황 정보 */}
          {property.rentalStatus && (
            <div className="bg-white/10 p-3 rounded">
              <h4 className="font-bold text-amber-300 mb-3 text-sm">🏪 임대현황</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-amber-200">상호</span>
                  <span className="font-bold text-amber-100">{property.rentalStatus.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-200">임대료</span>
                  <span className="font-bold text-amber-100">{property.rentalStatus.rent ? `${property.rentalStatus.rent.toLocaleString()}원` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-200">권리금</span>
                  <span className="font-bold text-amber-100">{property.rentalStatus.premium ? `${property.rentalStatus.premium.toLocaleString()}원` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-200">점주번호</span>
                  <span className="font-bold text-amber-100">{property.rentalStatus.operatorPhone || '-'}</span>
                </div>
              </div>
            </div>
          )}

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
                  className="w-full h-32 bg-white/20 border-2 border-amber-400 rounded p-2 text-amber-100 text-xs focus:outline-none focus:border-amber-300 resize-none"
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
              <textarea
                value={property.memo || ''}
                readOnly
                onDoubleClick={handleMemoDoubleClick}
                className="w-full h-32 bg-white/20 border-2 border-amber-700 rounded p-2 text-amber-100 text-xs focus:outline-none resize-none cursor-text hover:bg-white/30 transition-colors"
                placeholder="더블클릭하면 메모를 편집할 수 있습니다"
              />
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="pt-4 border-t-2 border-amber-700 space-y-2">
            <MapleButton
              className="w-full text-sm"
              onClick={handleEdit}
            >
              ✏️ 수정
            </MapleButton>
            <MapleButton
              className="w-full text-sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
            </MapleButton>
            <MapleButton
              className="w-full text-sm"
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
