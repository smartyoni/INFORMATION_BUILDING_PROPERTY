import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { seedInitialData } from '../utils/seedData';

const BuildingContext = createContext();

export function BuildingProvider({ children }) {
  const db = useIndexedDB();
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (!db.isReady) return;

    const loadData = async () => {
      try {
        setIsLoading(true);

        // 더미 데이터 시드 (처음 한 번만)
        await seedInitialData(db);

        const data = await db.getAll();
        setBuildings(data);
        applyFilters(data, selectedLocation, selectedType, searchQuery);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [db.isReady]);

  // 필터 적용
  const applyFilters = useCallback((data, location, type, search = '') => {
    let filtered = [...data];

    // 위치 필터
    if (location) {
      filtered = filtered.filter(b => b.location === location);
    }

    // 유형 필터
    if (type) {
      filtered = filtered.filter(b => b.type === type);
    }

    // 검색어 필터 (건물명)
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(lowerSearch)
      );
    }

    // 가나다순 정렬
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    setFilteredBuildings(filtered);
  }, []);

  // 위치 필터 변경
  const changeLocationFilter = useCallback((location) => {
    const newLocation = selectedLocation === location ? null : location;
    setSelectedLocation(newLocation);
    applyFilters(buildings, newLocation, selectedType, searchQuery);
  }, [buildings, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 유형 필터 변경
  const changeTypeFilter = useCallback((type) => {
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);
    applyFilters(buildings, selectedLocation, newType, searchQuery);
  }, [buildings, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 검색어 변경
  const changeSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    applyFilters(buildings, selectedLocation, selectedType, query);
  }, [buildings, selectedLocation, selectedType, applyFilters]);

  // 건물 추가
  const addBuilding = useCallback(async (building) => {
    try {
      setIsLoading(true);
      setError(null);
      const newBuilding = await db.add(building);
      const updated = [...buildings, newBuilding];
      setBuildings(updated);
      applyFilters(updated, selectedLocation, selectedType, searchQuery);
      return newBuilding;
    } catch (err) {
      const message = err.message || '건물 추가에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildings, db, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 건물 수정
  const updateBuilding = useCallback(async (building) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await db.update(building);
      const newBuildings = buildings.map(b => b.id === updated.id ? updated : b);
      setBuildings(newBuildings);
      applyFilters(newBuildings, selectedLocation, selectedType, searchQuery);
      return updated;
    } catch (err) {
      const message = err.message || '건물 수정에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildings, db, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 건물 삭제
  const deleteBuilding = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await db.remove(id);
      const newBuildings = buildings.filter(b => b.id !== id);
      setBuildings(newBuildings);
      applyFilters(newBuildings, selectedLocation, selectedType, searchQuery);
    } catch (err) {
      const message = err.message || '건물 삭제에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildings, db, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 일괄 추가 (CSV 임포트용)
  const addMultipleBuildings = useCallback(async (newBuildings) => {
    try {
      setIsLoading(true);
      setError(null);
      const added = await db.addMultiple(newBuildings);
      const updated = [...buildings, ...added];
      setBuildings(updated);
      applyFilters(updated, selectedLocation, selectedType, searchQuery);
      return added;
    } catch (err) {
      const message = err.message || '일괄 추가에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildings, db, selectedLocation, selectedType, searchQuery, applyFilters]);

  // 모든 데이터 삭제 후 새 데이터 추가 (CSV 덮어쓰기용)
  const replaceAllBuildings = useCallback(async (newBuildings) => {
    try {
      setIsLoading(true);
      setError(null);

      // 기존 모든 데이터 삭제
      const allBuildings = await db.getAll();
      for (const building of allBuildings) {
        await db.remove(building.id);
      }

      // 새 데이터 추가
      const added = await db.addMultiple(newBuildings);
      setBuildings(added);
      applyFilters(added, null, null, '');
      setSelectedLocation(null);
      setSelectedType(null);
      setSearchQuery('');
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
  const clearAllBuildings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await db.clearAll();
      setBuildings([]);
      setFilteredBuildings([]);
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
    buildings,
    filteredBuildings,
    selectedLocation,
    selectedType,
    searchQuery,
    isLoading,
    error,
    isDBReady: db.isReady,

    // 액션
    changeLocationFilter,
    changeTypeFilter,
    changeSearchQuery,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addMultipleBuildings,
    replaceAllBuildings,
    clearAllBuildings
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
}

export function useBuilding() {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error('useBuilding은 BuildingProvider 내에서 사용해야 합니다');
  }
  return context;
}
