import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const db = useIndexedDB('properties');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (!db.isReady) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await db.getAll();
        setProperties(data);
        applyFilters(data, selectedLocation, selectedType, searchQuery, selectedBuildingId);
      } catch (err) {
        console.error('매물 데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [db.isReady]);

  // 필터 적용
  const applyFilters = useCallback((data, location, type, search = '', buildingId = null) => {
    let filtered = [...data];

    // 건물 필터 (특정 건물의 매물만 표시)
    if (buildingId) {
      filtered = filtered.filter(p => p.buildingId === buildingId);
    }

    // 위치 필터
    if (location) {
      filtered = filtered.filter(p => p.location === location);
    }

    // 유형 필터
    if (type) {
      filtered = filtered.filter(p => p.type === type);
    }

    // 검색어 필터 (매물명)
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.propertyName.toLowerCase().includes(lowerSearch)
      );
    }

    // 접수일 역순 정렬 (최신순)
    filtered.sort((a, b) => {
      const dateA = new Date(a.receivedDate || 0);
      const dateB = new Date(b.receivedDate || 0);
      return dateB - dateA;
    });

    setFilteredProperties(filtered);
  }, []);

  // 위치 필터 변경
  const changeLocationFilter = useCallback((location) => {
    const newLocation = selectedLocation === location ? null : location;
    setSelectedLocation(newLocation);
    applyFilters(properties, newLocation, selectedType, searchQuery, selectedBuildingId);
  }, [properties, selectedLocation, selectedType, searchQuery, selectedBuildingId, applyFilters]);

  // 유형 필터 변경
  const changeTypeFilter = useCallback((type) => {
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);
    applyFilters(properties, selectedLocation, newType, searchQuery, selectedBuildingId);
  }, [properties, selectedLocation, selectedType, searchQuery, selectedBuildingId, applyFilters]);

  // 검색어 변경
  const changeSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    applyFilters(properties, selectedLocation, selectedType, query, selectedBuildingId);
  }, [properties, selectedLocation, selectedType, selectedBuildingId, applyFilters]);

  // 건물 선택 변경 (특정 건물의 매물만 보기)
  const changeSelectedBuilding = useCallback((buildingId) => {
    setSelectedBuildingId(buildingId);
    applyFilters(properties, selectedLocation, selectedType, searchQuery, buildingId);
  }, [properties, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 매물 추가
  const addProperty = useCallback(async (property) => {
    try {
      setIsLoading(true);
      setError(null);
      const newProperty = await db.add(property);
      const updated = [...properties, newProperty];
      setProperties(updated);
      applyFilters(updated, selectedLocation, selectedType, searchQuery, selectedBuildingId);
      return newProperty;
    } catch (err) {
      const message = err.message || '매물 추가에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [properties, db, selectedLocation, selectedType, searchQuery, selectedBuildingId, applyFilters]);

  // 매물 수정
  const updateProperty = useCallback(async (property) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await db.update(property);
      const newProperties = properties.map(p => p.id === updated.id ? updated : p);
      setProperties(newProperties);
      applyFilters(newProperties, selectedLocation, selectedType, searchQuery, selectedBuildingId);
      return updated;
    } catch (err) {
      const message = err.message || '매물 수정에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [properties, db, selectedLocation, selectedType, searchQuery, selectedBuildingId, applyFilters]);

  // 매물 삭제
  const deleteProperty = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await db.remove(id);
      const newProperties = properties.filter(p => p.id !== id);
      setProperties(newProperties);
      applyFilters(newProperties, selectedLocation, selectedType, searchQuery, selectedBuildingId);
    } catch (err) {
      const message = err.message || '매물 삭제에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [properties, db, selectedLocation, selectedType, searchQuery, selectedBuildingId, applyFilters]);

  // 일괄 추가 (CSV 임포트용)
  const addMultipleProperties = useCallback(async (newProperties) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('PropertyContext.addMultipleProperties 호출됨', { 개수: newProperties.length, 데이터: newProperties });
      const added = await db.addMultiple(newProperties);
      console.log('db.addMultiple 완료:', { 반환된개수: added.length });
      const updated = [...properties, ...added];
      setProperties(updated);
      applyFilters(updated, selectedLocation, selectedType, searchQuery, selectedBuildingId);
      return added;
    } catch (err) {
      const message = err.message || '일괄 추가에 실패했습니다';
      console.error('PropertyContext.addMultipleProperties 에러:', { 메시지: message, 상세: err });
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [properties, db, selectedLocation, selectedType, searchQuery, selectedBuildingId, applyFilters]);

  // 모든 데이터 삭제 후 새 데이터 추가 (CSV 덮어쓰기용)
  const replaceAllProperties = useCallback(async (newProperties) => {
    try {
      setIsLoading(true);
      setError(null);

      // 기존 모든 데이터 삭제
      const allProperties = await db.getAll();
      for (const property of allProperties) {
        await db.remove(property.id);
      }

      // 새 데이터 추가
      const added = await db.addMultiple(newProperties);
      setProperties(added);
      applyFilters(added, null, null, '', null);
      setSelectedLocation(null);
      setSelectedType(null);
      setSearchQuery('');
      setSelectedBuildingId(null);
      return added;
    } catch (err) {
      const message = err.message || '데이터 교체에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [db, applyFilters]);

  // 모든 데이터 삭제
  const clearAllProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await db.clearAll();
      setProperties([]);
      setFilteredProperties([]);
    } catch (err) {
      const message = err.message || '데이터 초기화에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  const value = {
    // 상태
    properties,
    filteredProperties,
    selectedLocation,
    selectedType,
    searchQuery,
    selectedBuildingId,
    isLoading,
    error,
    isDBReady: db.isReady,

    // 액션
    changeLocationFilter,
    changeTypeFilter,
    changeSearchQuery,
    changeSelectedBuilding,
    addProperty,
    updateProperty,
    deleteProperty,
    addMultipleProperties,
    replaceAllProperties,
    clearAllProperties
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty는 PropertyProvider 내에서 사용해야 합니다');
  }
  return context;
}
