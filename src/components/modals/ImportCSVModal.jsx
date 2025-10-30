import { useState } from 'react';
import { MapleButton, MapleFrame } from '../common/MapleFrame';
import { parseCSV, validateBuildings, normalizeBuilding } from '../../utils/csvImporter';
import { useBuilding } from '../../context/BuildingContext';

export function ImportCSVModal({ onClose }) {
  const { replaceAllBuildings } = useBuilding();
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('upload'); // upload, preview, progress
  const [parsedData, setParsedData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleParse = async () => {
    if (!file) {
      setError('파일을 선택해주세요');
      return;
    }

    try {
      setError(null);
      const parsed = await parseCSV(file);
      setParsedData(parsed);

      const validation = validateBuildings(parsed);
      setValidation(validation);

      if (!validation.isValid) {
        setError(`검증 실패:\n${validation.errors.join('\n')}`);
        return;
      }

      setStep('preview');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;

    try {
      setError(null);
      setStep('progress');

      const buildings = parsedData.map(normalizeBuilding);
      const total = buildings.length;

      // 진행 상황 시뮬레이션과 함께 임포트
      for (let i = 0; i < buildings.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // 시각적 진행 표시
        setImportProgress(Math.round(((i + 1) / total) * 100));
      }

      // 기존 데이터 삭제하고 새 데이터로 교체
      await replaceAllBuildings(buildings);
      setImportStatus({
        success: true,
        count: total
      });

      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message);
      setStep('preview');
    }
  };

  if (step === 'progress') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
          <div className="maple-header mb-4">📥 CSV 임포트 진행 중</div>

          {!importStatus && (
            <div className="space-y-4">
              <div className="bg-white/20 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-900 font-bold">진행률</span>
                  <span className="text-amber-900 font-bold">{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-400 rounded h-4">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded transition-all"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>

              <p className="text-amber-900 text-center font-bold">
                {importProgress < 100 ? '임포트 중...' : '완료!'}
              </p>
            </div>
          )}

          {importStatus?.success && (
            <div className="space-y-4 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-amber-900 font-bold">
                {importStatus.count}개의 건물을 임포트했습니다!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
          <div className="maple-header mb-4">📋 CSV 미리보기</div>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 p-3 rounded mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          {validation && !validation.isValid && (
            <div className="bg-yellow-500/20 border-2 border-yellow-500 p-3 rounded mb-4 text-yellow-300 text-sm">
              <p className="font-bold mb-2">검증 오류:</p>
              {validation.errors.map((e, i) => (
                <div key={i}>• {e}</div>
              ))}
            </div>
          )}

          {validation && validation.isValid && (
            <div className="bg-green-500/20 border-2 border-green-500 p-3 rounded mb-4 text-green-300 text-sm">
              ✓ 검증 성공: {validation.validCount}/{validation.totalCount}개 건물
            </div>
          )}

          <div className="bg-white/10 p-3 rounded mb-4 max-h-60 overflow-y-auto">
            <table className="w-full text-xs text-amber-900">
              <thead className="sticky top-0 bg-amber-700/30">
                <tr>
                  <th className="text-left p-2">건물명</th>
                  <th className="text-left p-2">위치</th>
                  <th className="text-left p-2">유형</th>
                  <th className="text-right p-2">층수</th>
                </tr>
              </thead>
              <tbody>
                {parsedData?.map((building, i) => (
                  <tr key={i} className="border-t border-amber-700/20 hover:bg-white/5">
                    <td className="p-2 font-bold">{building['건물명']}</td>
                    <td className="p-2">{building['위치']}</td>
                    <td className="p-2">{building['유형']}</td>
                    <td className="p-2 text-right">{building['층수']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton
              className="flex-1"
              onClick={() => {
                setStep('upload');
                setError(null);
              }}
            >
              뒤로
            </MapleButton>
            <MapleButton
              className="flex-1"
              onClick={handleImport}
              disabled={!validation?.isValid}
            >
              임포트
            </MapleButton>
            <MapleButton className="flex-1" onClick={onClose}>
              취소
            </MapleButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(90vh - 40px)' }}>
        <div className="maple-header mb-4">📥 CSV 파일 임포트</div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 p-3 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white/10 p-4 rounded border-2 border-dashed border-amber-700">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-amber-900 cursor-pointer"
            />
            {file && (
              <p className="text-amber-900 text-sm mt-2">
                선택된 파일: <span className="font-bold">{file.name}</span>
              </p>
            )}
          </div>

          <div className="bg-white/10 p-3 rounded text-xs text-amber-900">
            <p className="font-bold mb-2">📋 CSV 형식 예시:</p>
            <code className="text-amber-800">
              건물명,지번,사용승인일,층수,주차대수,세대수,위치,유형
            </code>
          </div>

          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton className="flex-1" onClick={handleParse}>
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
