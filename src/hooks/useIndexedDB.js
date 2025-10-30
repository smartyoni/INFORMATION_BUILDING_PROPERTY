import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'BuildingDB';
const DB_VERSION = 2; // 증가: properties 스토어 추가

export function useIndexedDB(storeName = 'buildings') {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // DB 초기화
  useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          console.error('DB 열기 실패');
          setError('데이터베이스를 열 수 없습니다');
        };

        request.onsuccess = (event) => {
          const database = event.target.result;
          setDb(database);
          setIsReady(true);
        };

        request.onupgradeneeded = (event) => {
          const database = event.target.result;

          // buildings 스토어
          if (!database.objectStoreNames.contains('buildings')) {
            const store = database.createObjectStore('buildings', { keyPath: 'id' });
            store.createIndex('name', 'name', { unique: true });
            store.createIndex('location', 'location', { unique: false });
            store.createIndex('type', 'type', { unique: false });
          }

          // properties 스토어
          if (!database.objectStoreNames.contains('properties')) {
            const store = database.createObjectStore('properties', { keyPath: 'id' });
            store.createIndex('buildingId', 'buildingId', { unique: false });
            store.createIndex('category', 'category', { unique: false });
            store.createIndex('receivedDate', 'receivedDate', { unique: false });
          }
        };
      } catch (err) {
        console.error('DB 초기화 오류:', err);
        setError(err.message);
      }
    };

    initDB();
  }, []);

  // 모든 데이터 조회
  const getAll = useCallback(async () => {
    if (!db) return [];
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(new Error('데이터 조회 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 단일 데이터 조회
  const getById = useCallback(async (id) => {
    if (!db) return null;
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(new Error('데이터 조회 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 데이터 추가
  const add = useCallback(async (item) => {
    if (!db) throw new Error('DB가 준비되지 않았습니다');

    const newItem = {
      ...item,
      id: item.id || `${Date.now()}-${Math.random()}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(newItem);

        request.onsuccess = () => {
          resolve(newItem);
        };
        request.onerror = () => {
          reject(new Error('데이터 추가 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 데이터 수정
  const update = useCallback(async (item) => {
    if (!db) throw new Error('DB가 준비되지 않았습니다');

    const updatedItem = {
      ...item,
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(updatedItem);

        request.onsuccess = () => {
          resolve(updatedItem);
        };
        request.onerror = () => {
          reject(new Error('데이터 수정 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 데이터 삭제
  const remove = useCallback(async (id) => {
    if (!db) throw new Error('DB가 준비되지 않았습니다');

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve(true);
        };
        request.onerror = () => {
          reject(new Error('데이터 삭제 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 필터링 조회 (위치, 유형)
  const getFiltered = useCallback(async (location, type) => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          let results = request.result;

          if (location) {
            results = results.filter(b => b.location === location);
          }
          if (type) {
            results = results.filter(b => b.type === type);
          }

          resolve(results);
        };
        request.onerror = () => {
          reject(new Error('필터링 조회 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 모든 데이터 삭제
  const clearAll = useCallback(async () => {
    if (!db) throw new Error('DB가 준비되지 않았습니다');

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          resolve(true);
        };
        request.onerror = () => {
          reject(new Error('데이터 초기화 실패'));
        };
      } catch (err) {
        reject(err);
      }
    });
  }, [db, storeName]);

  // 일괄 추가
  const addMultiple = useCallback(async (items) => {
    if (!db) throw new Error('DB가 준비되지 않았습니다');

    const newItems = items.map(item => ({
      ...item,
      id: item.id || `${Date.now()}-${Math.random()}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        newItems.forEach((item, index) => {
          const request = store.add(item);
          request.onerror = () => {
            const error = request.error;
            console.error(`항목 ${index} 추가 실패:`, error, item);
          };
        });

        transaction.oncomplete = () => {
          console.log(`${storeName} 일괄 추가 완료: ${newItems.length}개 항목`);
          resolve(newItems);
        };
        transaction.onerror = () => {
          const error = transaction.error;
          console.error('트랜잭션 에러:', error);
          reject(new Error(`일괄 추가 실패: ${error?.message || '알 수 없는 오류'}`));
        };
      } catch (err) {
        console.error('addMultiple 실행 중 오류:', err);
        reject(err);
      }
    });
  }, [db, storeName]);

  return {
    isReady,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    getFiltered,
    clearAll,
    addMultiple
  };
}
