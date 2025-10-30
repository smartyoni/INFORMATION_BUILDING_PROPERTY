export function createBackupFile(buildings) {
  const backup = {
    metadata: {
      version: '1.0',
      backupDate: new Date().toISOString(),
      totalCount: buildings.length,
      exportedFrom: 'building-management-pwa'
    },
    buildings: buildings
  };

  return JSON.stringify(backup, null, 2);
}

export function downloadBackup(buildings) {
  const content = createBackupFile(buildings);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

  link.href = url;
  link.download = `buildings-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function parseBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.buildings || !Array.isArray(backup.buildings)) {
          reject(new Error('유효한 백업 파일이 아닙니다'));
          return;
        }

        resolve(backup);
      } catch (err) {
        reject(new Error('파일 파싱 실패: ' + err.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

export function validateBackupFile(backup) {
  const errors = [];

  if (!backup.metadata) {
    errors.push('메타데이터가 없습니다');
  }

  if (!Array.isArray(backup.buildings)) {
    errors.push('건물 데이터가 배열이 아닙니다');
  } else {
    backup.buildings.forEach((building, index) => {
      if (!building.name || !building.address) {
        errors.push(`행 ${index + 1}: 필수 정보가 없습니다`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    metadata: backup.metadata,
    count: backup.buildings?.length || 0
  };
}

export function mergeBuildings(existing, newBuildings) {
  // 건물명 기준으로 중복 체크
  const existingNames = new Set(existing.map(b => b.name));
  const toAdd = newBuildings.filter(b => !existingNames.has(b.name));

  return {
    merged: [...existing, ...toAdd],
    addedCount: toAdd.length,
    skippedCount: newBuildings.length - toAdd.length
  };
}

export function replaceBuildings(newBuildings) {
  return {
    replaced: newBuildings,
    replacedCount: newBuildings.length
  };
}
