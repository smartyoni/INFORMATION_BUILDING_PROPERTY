import { useState, useMemo } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { useBuilding } from '../../context/BuildingContext';
import { MapleButton } from '../common/MapleFrame';
import { locations, types } from '../../data/mockData';

export function AddPropertyModal({ onClose }) {
  const { addProperty } = useProperty();
  const { buildings } = useBuilding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [buildingSearch, setBuildingSearch] = useState('');
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [formData, setFormData] = useState({
    buildingId: '',
    buildingName: '',
    unitNumber: '',
    location: '',
    type: '',
    category: '매매',
    price: '',
    moveInDate: '',
    owner: '',
    ownerPhone: '',
    rentalInfo: '',
    memo: ''
  });

  // 건물 검색 필터링
  const filteredBuildings = useMemo(() => {
    if (!buildingSearch.trim()) return buildings;
    return buildings.filter(b => b.name.includes(buildingSearch.trim()));
  }, [buildingSearch, buildings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? (value ? parseInt(value) : '') : value
    });
    setError(null);
  };

  const handleBuildingSelect = (building) => {
    setFormData({
      ...formData,
      buildingId: building.id,
      buildingName: building.name
    });
    setBuildingSearch('');
    setShowBuildingDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 건물명과 호실명 합치기
    const propertyName = `${formData.buildingName}${formData.unitNumber ? ` ${formData.unitNumber}` : ''}`.trim();

    if (!propertyName) {
      setError('건물명은 필수입니다');
      return;
    }

    try {
      setIsSubmitting(true);
      await addProperty({
        propertyName: propertyName,
        location: formData.location,
        type: formData.type,
        category: formData.category,
        receivedDate: new Date().toISOString().split('T')[0],
        price: formData.price ? parseInt(formData.price) : 0,
        moveInDate: formData.moveInDate,
        owner: formData.owner.trim(),
        ownerPhone: formData.ownerPhone.trim(),
        buildingId: formData.buildingId,
        memo: formData.memo.trim(),
        rentalStatus: null
      });
      onClose();
    } catch (err) {
      setError(err.message || '매물 추가에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="maple-modal w-full my-4">
        {/* 헤더 */}
        <div className="maple-header mb-4 flex justify-between items-center">
          <span>➕ 매물 추가</span>
          <button
            onClick={onClose}
            className="text-amber-700 font-bold text-xl hover:text-amber-900"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 p-3 rounded mb-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 max-h-96 overflow-y-auto px-4">
          {/* 1. 위치, 매물유형, 구분 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">위치</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              >
                <option value="">선택</option>
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">매물유형</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              >
                <option value="">선택</option>
                {types.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">구분</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              >
                <option value="매매">매매</option>
                <option value="임대">임대</option>
              </select>
            </div>
          </div>

          {/* 2. 건물명(검색)과 호실명 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <label className="block text-amber-300 font-bold text-sm mb-1">
                건물명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={buildingSearch}
                onChange={(e) => {
                  setBuildingSearch(e.target.value);
                  setShowBuildingDropdown(true);
                }}
                onFocus={() => setShowBuildingDropdown(true)}
                placeholder="검색..."
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
              {formData.buildingName && (
                <div className="text-xs text-amber-300 mt-1">✓ {formData.buildingName}</div>
              )}

              {showBuildingDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-amber-700 rounded mt-1 max-h-40 overflow-y-auto z-10">
                  {filteredBuildings.length > 0 ? (
                    filteredBuildings.map(building => (
                      <button
                        key={building.id}
                        type="button"
                        onClick={() => handleBuildingSelect(building)}
                        className="w-full text-left px-3 py-2 text-amber-900 hover:bg-amber-100 border-b border-amber-300 last:border-b-0 text-sm"
                      >
                        {building.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-amber-700 text-xs">해당하는 건물이 없습니다</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">호실명</label>
              <input
                type="text"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleChange}
                placeholder="예: 101호"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 3. 금액과 입주일 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">금액</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">입주일</label>
              <input
                type="date"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 4. 소유자와 소유자번호 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">소유자</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">소유자번호</label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 5. 임대차정보 */}
          <div>
            <label className="block text-amber-300 font-bold text-sm mb-1">임대차정보</label>
            <textarea
              name="rentalInfo"
              value={formData.rentalInfo}
              onChange={handleChange}
              placeholder="상호: 카페명&#10;임대료: 2,000,000원&#10;권리금: 50,000,000원&#10;점주번호: 010-1234-5678"
              rows="3"
              className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm resize-none"
            />
          </div>

          {/* 6. 메모 */}
          <div>
            <label className="block text-amber-300 font-bold text-sm mb-1">메모</label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="추가 정보나 특이사항을 입력하세요"
              rows="3"
              className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm resize-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '추가 중...' : '추가'}
            </MapleButton>
            <MapleButton
              type="button"
              className="flex-1"
              onClick={onClose}
            >
              취소
            </MapleButton>
          </div>
        </form>
      </div>
    </div>
  );
}
