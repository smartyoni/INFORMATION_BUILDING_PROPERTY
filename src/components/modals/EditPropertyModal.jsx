import { useState, useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { useBuilding } from '../../context/BuildingContext';
import { MapleButton } from '../common/MapleFrame';
import { locations, types } from '../../data/mockData';

export function EditPropertyModal({ property, onClose }) {
  const { updateProperty } = useProperty();
  const { buildings } = useBuilding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    buildingId: property?.buildingId || '',
    propertyName: property?.propertyName || '',
    category: property?.category || '매매',
    receivedDate: property?.receivedDate || new Date().toISOString().split('T')[0],
    price: property?.price || '',
    moveInDate: property?.moveInDate || '',
    owner: property?.owner || '',
    ownerPhone: property?.ownerPhone || '',
    location: property?.location || '',
    type: property?.type || '',
    rentalStatus: property?.rentalStatus || {
      name: '',
      rent: '',
      premium: '',
      operatorPhone: ''
    }
  });

  useEffect(() => {
    setFormData({
      buildingId: property?.buildingId || '',
      propertyName: property?.propertyName || '',
      category: property?.category || '매매',
      receivedDate: property?.receivedDate || new Date().toISOString().split('T')[0],
      price: property?.price || '',
      moveInDate: property?.moveInDate || '',
      owner: property?.owner || '',
      ownerPhone: property?.ownerPhone || '',
      location: property?.location || '',
      type: property?.type || '',
      rentalStatus: property?.rentalStatus || {
        name: '',
        rent: '',
        premium: '',
        operatorPhone: ''
      }
    });
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('rental_')) {
      const field = name.replace('rental_', '');
      setFormData({
        ...formData,
        rentalStatus: {
          ...formData.rentalStatus,
          [field]: value ? (field !== 'name' && field !== 'operatorPhone' ? parseInt(value) : value) : ''
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'price' ? (value ? parseInt(value) : '') : value
      });
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.propertyName.trim()) {
      setError('매물명은 필수입니다');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProperty({
        ...property,
        propertyName: formData.propertyName.trim(),
        category: formData.category,
        receivedDate: formData.receivedDate,
        price: formData.price ? parseInt(formData.price) : 0,
        moveInDate: formData.moveInDate,
        owner: formData.owner.trim(),
        ownerPhone: formData.ownerPhone.trim(),
        buildingId: formData.buildingId,
        location: formData.location,
        type: formData.type,
        rentalStatus: formData.rentalStatus.name ? {
          name: formData.rentalStatus.name.trim(),
          rent: formData.rentalStatus.rent ? parseInt(formData.rentalStatus.rent) : 0,
          premium: formData.rentalStatus.premium ? parseInt(formData.rentalStatus.premium) : 0,
          operatorPhone: formData.rentalStatus.operatorPhone.trim()
        } : null
      });
      onClose();
    } catch (err) {
      setError(err.message || '매물 수정에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="maple-modal w-full my-4">
        {/* 헤더 */}
        <div className="maple-header mb-4 flex justify-between items-center">
          <span>✏️ 매물 수정</span>
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
          {/* 위치와 구분 - 같은 라인 */}
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

          {/* 매물명과 유형 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">
                매물명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
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
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 접수일과 금액 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">접수일</label>
              <input
                type="date"
                name="receivedDate"
                value={formData.receivedDate}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

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
          </div>

          {/* 입주일과 건물 */}
          <div className="flex gap-2">
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

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">건물</label>
              <select
                name="buildingId"
                value={formData.buildingId}
                onChange={handleChange}
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
              >
                <option value="">선택</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 소유자와 소유자번호 */}
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

          {/* 임대현황 - 상호와 임대료 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">상호</label>
              <input
                type="text"
                name="rental_name"
                value={formData.rentalStatus.name}
                onChange={handleChange}
                placeholder="입력"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">임대료</label>
              <input
                type="number"
                name="rental_rent"
                value={formData.rentalStatus.rent}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* 권리금과 점주번호 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">권리금</label>
              <input
                type="number"
                name="rental_premium"
                value={formData.rentalStatus.premium}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-white/20 border-2 border-amber-700 rounded px-3 py-2 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="flex-1">
              <label className="block text-amber-300 font-bold text-sm mb-1">점주번호</label>
              <input
                type="tel"
                name="rental_operatorPhone"
                value={formData.rentalStatus.operatorPhone}
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
