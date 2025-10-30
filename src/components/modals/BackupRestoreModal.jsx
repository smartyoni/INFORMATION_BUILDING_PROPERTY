import { useState } from 'react';
import { MapleButton } from '../common/MapleFrame';
import { downloadBackup, parseBackupFile, validateBackupFile, mergeBuildings, replaceBuildings } from '../../utils/jsonBackup';
import { useBuilding } from '../../context/BuildingContext';

export function BackupRestoreModal({ onClose, mode = 'backup' }) {
  const { buildings, addMultipleBuildings, clearAllBuildings } = useBuilding();
  const [restoreMode, setRestoreMode] = useState('merge'); // merge or replace
  const [file, setFile] = useState(null);
  const [backupData, setBackupData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [step, setStep] = useState(mode === 'backup' ? 'confirm' : 'upload');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 백업 모드
  const handleBackup = async () => {
    try {
      setIsProcessing(true);
      downloadBackup(buildings);
      alert(`${buildings.length}개의 건물 데이터를 백업했습니다!`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 복원 모드 - 파일 선택
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  // 복원 모드 - 파일 파싱
  const handleParseBackup = async () => {
    if (!file) {
      setError('파일을 선택해주세요');
      return;
    }

    try {
      setError(null);
      const backup = await parseBackupFile(file);
      const validation = validateBackupFile(backup);

      setBackupData(backup);
      setValidation(validation);

      if (!validation.isValid) {
        setError(`검증 실패:\n${validation.errors.join('\n')}`);
        return;
      }

      setStep('mode');
    } catch (err) {
      setError(err.message);
    }
  };

  // 복원 모드 - 복원 실행
  const handleRestore = async () => {
    if (!backupData) return;

    try {
      setError(null);
      setIsProcessing(true);

      if (restoreMode === 'replace') {
        // 기존 데이터 삭제 후 새 데이터 추가
        await clearAllBuildings();
        await addMultipleBuildings(backupData.buildings);
        alert(`${backupData.buildings.length}개의 건물 데이터를 복원했습니다!`);
      } else {
        // 병합 모드
        const { merged, addedCount, skippedCount } = mergeBuildings(buildings, backupData.buildings);
        await addMultipleBuildings(backupData.buildings.filter(b => !buildings.find(ex => ex.name === b.name)));
        alert(`${addedCount}개의 새로운 건물을 추가했습니다!\n${skippedCount}개는 중복되어 스킵되었습니다.`);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 백업 확인 단계
  if (mode === 'backup' && step === 'confirm') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
          <div className="maple-header mb-4">💾 데이터 백업</div>

          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded border-2 border-amber-700">
              <p className="text-amber-900 text-center font-bold text-lg">
                {buildings.length}개의 건물
              </p>
              <p className="text-amber-800 text-center text-sm mt-2">
                현재 저장된 모든 건물 데이터를 JSON 형식으로 백업합니다.
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded text-xs text-amber-900">
              <p className="font-bold mb-2">백업 정보:</p>
              <div>• 파일명: buildings-backup-[날짜].json</div>
              <div>• 형식: JSON</div>
              <div>• 포함: 모든 건물 정보, 메타데이터</div>
            </div>

            <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
              <MapleButton
                className="flex-1"
                onClick={handleBackup}
                disabled={isProcessing || buildings.length === 0}
              >
                {isProcessing ? '진행 중...' : '백업 다운로드'}
              </MapleButton>
              <MapleButton className="flex-1" onClick={onClose}>
                취소
              </MapleButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 복원 파일 선택 단계
  if (mode === 'restore' && step === 'upload') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
          <div className="maple-header mb-4">♻️ 데이터 복원</div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 p-3 rounded text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="bg-white/10 p-4 rounded border-2 border-dashed border-amber-700">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="w-full text-amber-900 cursor-pointer"
              />
              {file && (
                <p className="text-amber-900 text-sm mt-2">
                  선택된 파일: <span className="font-bold">{file.name}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
              <MapleButton className="flex-1" onClick={handleParseBackup} disabled={!file}>
                다음
              </MapleButton>
              <MapleButton className="flex-1" onClick={onClose}>
                취소
              </MapleButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 복원 모드 선택 단계
  if (mode === 'restore' && step === 'mode') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
          <div className="maple-header mb-4">♻️ 복원 방식 선택</div>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 p-3 rounded mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          {validation && (
            <div className="bg-green-500/20 border-2 border-green-500 p-3 rounded mb-4 text-green-300 text-sm">
              ✓ 유효한 백업 파일입니다 ({validation.count}개 건물)
            </div>
          )}

          <div className="space-y-3">
            {/* 병합 모드 */}
            <label className="flex items-start gap-3 p-3 border-2 border-amber-700 rounded cursor-pointer hover:bg-white/5">
              <input
                type="radio"
                value="merge"
                checked={restoreMode === 'merge'}
                onChange={(e) => setRestoreMode(e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-bold text-amber-900">병합 모드</div>
                <div className="text-xs text-amber-800">
                  기존 데이터는 유지하고 새로운 건물만 추가합니다.
                  <br />
                  같은 이름의 건물은 추가되지 않습니다.
                </div>
              </div>
            </label>

            {/* 덮어쓰기 모드 */}
            <label className="flex items-start gap-3 p-3 border-2 border-amber-700 rounded cursor-pointer hover:bg-white/5">
              <input
                type="radio"
                value="replace"
                checked={restoreMode === 'replace'}
                onChange={(e) => setRestoreMode(e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-bold text-amber-900">덮어쓰기 모드</div>
                <div className="text-xs text-amber-800">
                  기존 데이터를 모두 삭제하고 백업 데이터로 복원합니다.
                  <br />
                  <span className="text-red-400 font-bold">⚠️ 기존 데이터가 손실됩니다!</span>
                </div>
              </div>
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton
              className="flex-1"
              onClick={handleRestore}
              disabled={isProcessing}
            >
              {isProcessing ? '진행 중...' : '복원'}
            </MapleButton>
            <MapleButton className="flex-1" onClick={onClose}>
              취소
            </MapleButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
