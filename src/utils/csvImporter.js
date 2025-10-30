export async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('CSV 파일이 비어있습니다'));
          return;
        }

        // 헤더 파싱 - 더 견고한 처리
        let headerLine = lines[0];
        // BOM 제거
        headerLine = headerLine.replace(/^\uFEFF/, '');
        const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));

        // 필수 컬럼은 건물명만
        const requiredColumns = ['건물명'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          reject(new Error(`필수 컬럼이 없습니다: ${missingColumns.join(', ')}\n실제 컬럼: ${headers.join(', ')}`));
          return;
        }

        // 데이터 파싱
        const buildings = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // CSV 값 파싱 - 따옴표와 쉼표를 더 정확하게 처리
          const values = parseCSVLine(line);
          const building = {};

          headers.forEach((header, index) => {
            building[header] = (values[index] || '').trim();
          });

          // 숫자 필드 변환
          if (building['층수']) building['층수'] = parseInt(building['층수']) || 0;
          if (building['주차대수']) {
            // "15대" 형식 처리
            const parkingStr = building['주차대수'].replace(/[^0-9]/g, '');
            building['주차대수'] = parseInt(parkingStr) || 0;
          }
          if (building['세대수']) building['세대수'] = parseInt(building['세대수']) || 0;

          buildings.push(building);
        }

        resolve(buildings);
      } catch (err) {
        reject(new Error('CSV 파싱 실패: ' + err.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

// CSV 라인을 더 정확하게 파싱하는 함수
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // 다음 따옴표 건너뛰기
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map(v => v.replace(/^"|"$/g, '').trim());
}

export function validateBuildings(buildings) {
  const errors = [];
  const validLocations = ['마곡', '발산', '향교', '나루', '신방화', '가양', '등촌', '공항', '화곡', '기타'];
  const validTypes = ['오피스텔', '상업용', '아파트', '지산', '기타'];

  buildings.forEach((building, index) => {
    const row = index + 2; // CSV는 헤더를 포함하므로 +2

    // 필수: 건물명만 체크
    if (!building['건물명'] || building['건물명'].trim() === '') {
      errors.push(`행 ${row}: 건물명이 필수입니다`);
    }

    // 선택: 위치와 유형이 있으면 유효성만 체크
    if (building['위치'] && building['위치'].trim() !== '') {
      if (!validLocations.includes(building['위치'].trim())) {
        errors.push(`행 ${row}: 유효하지 않은 위치입니다 (${building['위치']}). 가능한 값: ${validLocations.join(', ')}`);
      }
    }

    if (building['유형'] && building['유형'].trim() !== '') {
      if (!validTypes.includes(building['유형'].trim())) {
        errors.push(`행 ${row}: 유효하지 않은 유형입니다 (${building['유형']}). 가능한 값: ${validTypes.join(', ')}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validCount: buildings.filter(b => b['건물명'] && b['건물명'].trim() !== '').length,
    totalCount: buildings.length
  };
}

export function normalizeBuilding(csvBuilding) {
  // 주차대수에서 숫자만 추출
  let parking = 0;
  if (csvBuilding['주차대수']) {
    const parkingStr = csvBuilding['주차대수'].toString().replace(/[^0-9]/g, '');
    parking = parseInt(parkingStr) || 0;
  }

  // 세대수에서 숫자만 추출
  let households = 0;
  if (csvBuilding['세대수']) {
    const householdsStr = csvBuilding['세대수'].toString().replace(/[^0-9]/g, '');
    households = parseInt(householdsStr) || 0;
  }

  // 층수에서 숫자만 추출
  let floors = 0;
  if (csvBuilding['층수']) {
    const floorsStr = csvBuilding['층수'].toString().replace(/[^0-9]/g, '');
    floors = parseInt(floorsStr) || 0;
  }

  return {
    name: csvBuilding['건물명'] || '',
    address: csvBuilding['지번'] || '',
    approvalDate: csvBuilding['사용승인일'] || '',
    floors: floors,
    parking: parking,
    households: households,
    doorPassword: csvBuilding['공동현관비번'] || '',
    managementPhone: csvBuilding['관리실번호'] || '',
    location: csvBuilding['위치'] || '',
    type: csvBuilding['유형'] || '',
    icon: '🏢'
  };
}

// ============== 매물 CSV 임포터 ==============

export async function parsePropertyCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('CSV 파일이 비어있습니다'));
          return;
        }

        // 헤더 파싱
        let headerLine = lines[0];
        // BOM 제거
        headerLine = headerLine.replace(/^\uFEFF/, '');
        const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));

        // 필수 컬럼은 매물명만
        const requiredColumns = ['매물명'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          reject(new Error(`필수 컬럼이 없습니다: ${missingColumns.join(', ')}\n실제 컬럼: ${headers.join(', ')}`));
          return;
        }

        // 데이터 파싱
        const properties = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = parseCSVLine(line);
          const property = {};

          headers.forEach((header, index) => {
            property[header] = (values[index] || '').trim();
          });

          // 숫자 필드 변환
          if (property['금액']) property['금액'] = parseInt(property['금액'].replace(/[^0-9]/g, '')) || 0;
          if (property['임대료']) property['임대료'] = parseInt(property['임대료'].replace(/[^0-9]/g, '')) || 0;
          if (property['권리금']) property['권리금'] = parseInt(property['권리금'].replace(/[^0-9]/g, '')) || 0;

          properties.push(property);
        }

        resolve(properties);
      } catch (err) {
        reject(new Error('CSV 파싱 실패: ' + err.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

export function validateProperties(properties, buildings) {
  const errors = [];
  const validLocations = ['마곡', '발산', '향교', '나루', '신방화', '가양', '등촌', '공항', '화곡', '기타'];
  const validPropertyTypes = ['오피스텔', '상업용', '아파트', '지산', '기타'];
  const validCategories = ['매매', '임대'];
  const buildingNames = buildings.map(b => b.name);

  properties.forEach((property, index) => {
    const row = index + 2; // CSV는 헤더를 포함하므로 +2

    // 필수: 건물명만 체크
    if (!property['건물명'] || property['건물명'].trim() === '') {
      errors.push(`행 ${row}: 건물명이 필수입니다`);
      return;
    }

    // 선택: 위치가 있으면 유효성 체크
    if (property['위치'] && property['위치'].trim() !== '') {
      if (!validLocations.includes(property['위치'].trim())) {
        errors.push(`행 ${row}: 유효하지 않은 위치입니다 (${property['위치']}). 가능한 값: ${validLocations.join(', ')}`);
      }
    }

    // 선택: 매물유형이 있으면 유효성 체크
    if (property['매물유형'] && property['매물유형'].trim() !== '') {
      if (!validPropertyTypes.includes(property['매물유형'].trim())) {
        errors.push(`행 ${row}: 유효하지 않은 매물유형입니다 (${property['매물유형']}). 가능한 값: ${validPropertyTypes.join(', ')}`);
      }
    }

    // 선택: 구분이 있으면 유효성 체크
    if (property['구분'] && property['구분'].trim() !== '') {
      if (!validCategories.includes(property['구분'].trim())) {
        errors.push(`행 ${row}: 유효하지 않은 구분입니다 (${property['구분']}). 가능한 값: ${validCategories.join(', ')}`);
      }
    }

    // 선택: 건물이 있으면 존재여부 체크
    if (property['건물'] && property['건물'].trim() !== '') {
      if (!buildingNames.includes(property['건물'].trim())) {
        errors.push(`행 ${row}: 존재하지 않는 건물입니다 (${property['건물']}). 먼저 건물을 추가하세요.`);
      }
    }

    // 날짜 형식 검증
    if (property['접수일'] && property['접수일'].trim() !== '') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(property['접수일'].trim())) {
        errors.push(`행 ${row}: 접수일 형식이 잘못되었습니다 (${property['접수일']}). 형식: YYYY-MM-DD`);
      }
    }

    if (property['입주일'] && property['입주일'].trim() !== '') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(property['입주일'].trim())) {
        errors.push(`행 ${row}: 입주일 형식이 잘못되었습니다 (${property['입주일']}). 형식: YYYY-MM-DD`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validCount: properties.filter(p => p['매물명'] && p['매물명'].trim() !== '').length,
    totalCount: properties.length
  };
}

export function normalizeProperty(csvProperty, buildings) {
  // 건물명과 호실명을 합쳐서 매물명 생성
  const buildingName = csvProperty['건물명']?.trim() || '';
  const unitNumber = csvProperty['호실명']?.trim() || '';
  const propertyName = `${buildingName}${unitNumber ? ` ${unitNumber}` : ''}`.trim();

  // 건물 ID 찾기
  const building = buildings.find(b => b.name === buildingName);
  const buildingId = building?.id || null;

  // 금액에서 숫자만 추출
  let price = 0;
  if (csvProperty['금액']) {
    const priceStr = csvProperty['금액'].toString().replace(/[^0-9]/g, '');
    price = parseInt(priceStr) || 0;
  }

  return {
    propertyName: propertyName,
    category: csvProperty['구분'] || '매매',
    receivedDate: csvProperty['접수일'] || new Date().toISOString().split('T')[0],
    price: price,
    moveInDate: csvProperty['입주일'] || '',
    owner: csvProperty['소유자'] || '',
    ownerPhone: csvProperty['소유자번호'] || '',
    location: csvProperty['위치'] || '',
    type: csvProperty['매물유형'] || '',
    buildingId: buildingId || '',
    memo: csvProperty['메모'] || '',
    rentalStatus: null
  };
}
