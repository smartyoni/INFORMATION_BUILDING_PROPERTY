import { useState, useEffect } from 'react';
import { MapleButton } from '../common/MapleFrame';
import { useBuilding } from '../../context/BuildingContext';
import { locations, types } from '../../data/mockData';

export function EditBuildingModal({ building, onClose }) {
  const { updateBuilding } = useBuilding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    approvalDate: '',
    floors: '',
    parking: '',
    households: '',
    doorPassword: '',
    managementPhone: '',
    location: '',
    type: '',
  });

  // 건물 정보로 폼 초기화
  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name || '',
        address: building.address || '',
        approvalDate: building.approvalDate || '',
        floors: building.floors || '',
        parking: building.parking || '',
        households: building.households || '',
        doorPassword: building.doorPassword || '',
        managementPhone: building.managementPhone || '',
        location: building.location || '',
        type: building.type || '',
        memo: building.memo || ''
      });
    }
  }, [building]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 건물명 필수 체크
    if (!formData.name.trim()) {
      setError('건물명은 필수입니다');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedBuilding = {
        ...building,
        name: formData.name.trim(),
        address: formData.address.trim(),
        approvalDate: formData.approvalDate,
        floors: formData.floors ? parseInt(formData.floors) : 0,
        parking: formData.parking ? parseInt(formData.parking) : 0,
        households: formData.households ? parseInt(formData.households) : 0,
        doorPassword: formData.doorPassword.trim(),
        managementPhone: formData.managementPhone.trim(),
        location: formData.location,
        type: formData.type,
        memo: formData.memo.trim()
      };

      await updateBuilding(updatedBuilding);
      onClose();
    } catch (err) {
      setError(err.message || '건물 수정에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="maple-modal w-full my-4">
        {/* 헤더 */}
        <div className="maple-header mb-4 flex justify-between items-center">
          <span>✏️ 건물 수정</span>
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
          {/* 위치와 유형 - 같은 라인 */}
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
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">유형</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              >
                <option value="">선택</option>
                {types.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 건물명과 지번 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">
                건물명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">지번</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 사용승인일과 층수 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">사용승인일</label>
              <input
                type="date"
                name="approvalDate"
                value={formData.approvalDate}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">층수</label>
              <input
                type="number"
                name="floors"
                value={formData.floors}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 주차대수와 세대수 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">주차대수</label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">세대수</label>
              <input
                type="number"
                name="households"
                value={formData.households}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 공동현관비번과 관리실번호 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">공동현관비번</label>
              <input
                type="text"
                name="doorPassword"
                value={formData.doorPassword}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">관리실번호</label>
              <input
                type="tel"
                name="managementPhone"
                value={formData.managementPhone}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '수정 중...' : '수정'}
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
