import { useState } from 'react';
import { MapleButton } from '../common/MapleFrame';
import { parsePropertyCSV, validateProperties, normalizeProperty } from '../../utils/csvImporter';
import { useProperty } from '../../context/PropertyContext';
import { useBuilding } from '../../context/BuildingContext';

export function ImportPropertyCSVModal({ onClose }) {
  const { addMultipleProperties } = useProperty();
  const { buildings } = useBuilding();
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
      const parsed = await parsePropertyCSV(file);
      setParsedData(parsed);

      const validation = validateProperties(parsed, buildings);
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

      const properties = parsedData.map(p => normalizeProperty(p, buildings));
      const total = properties.length;

      console.log('임포트할 매물 데이터:', properties);
      console.log('매물 개수:', total);

      // 진행 상황 시뮬레이션과 함께 임포트
      for (let i = 0; i < properties.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // 시각적 진행 표시
        setImportProgress(Math.round(((i + 1) / total) * 100));
      }

      console.log('addMultipleProperties 함수 호출 시작...');
      // 매물 추가
      const result = await addMultipleProperties(properties);
      console.log('addMultipleProperties 성공:', result);

      setImportStatus({
        success: true,
        count: total
      });

      setTimeout(onClose, 1500);
    } catch (err) {
      console.error('임포트 실패 상세 에러 객체:', err);
      console.error('에러 메시지:', err.message);
      console.error('에러 스택:', err.stack);
      setError(`일괄 추가 실패: ${err.message}`);
      setStep('preview');
    }
  };

  if (step === 'progress') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(202.5vh - 40px)' }}>
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
                {importStatus.count}개의 매물을 임포트했습니다!
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
        <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(202.5vh - 40px)' }}>
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
              ✓ 검증 성공: {validation.validCount}/{validation.totalCount}개 매물
            </div>
          )}

          <div className="bg-white/10 p-3 rounded mb-4 max-h-60 overflow-y-auto">
            <table className="w-full text-xs text-amber-900">
              <thead className="sticky top-0 bg-amber-700/30">
                <tr>
                  <th className="text-left p-2">건물명</th>
                  <th className="text-left p-2">호실명</th>
                  <th className="text-left p-2">위치</th>
                  <th className="text-left p-2">구분</th>
                  <th className="text-right p-2">금액</th>
                </tr>
              </thead>
              <tbody>
                {parsedData?.map((property, i) => (
                  <tr key={i} className="border-t border-amber-700/20 hover:bg-white/5">
                    <td className="p-2 font-bold">{property['건물명']}</td>
                    <td className="p-2">{property['호실명'] || '-'}</td>
                    <td className="p-2">{property['위치'] || '-'}</td>
                    <td className="p-2">{property['구분'] || '매매'}</td>
                    <td className="p-2 text-right">{property['금액'] ? `${parseInt(property['금액']).toLocaleString()}원` : '-'}</td>
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
      <div className="maple-modal w-full my-4" style={{ maxWidth: '70%', maxHeight: 'calc(202.5vh - 40px)' }}>
        <div className="maple-header mb-4">📥 CSV 파일 임포트</div>

        <div className="space-y-4 px-4">
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
            <div className="font-mono text-amber-800 overflow-x-auto mb-3">
              <div>접수일,위치,매물유형,구분,건물명,호실명,금액,입주일,소유자,소유자번호,임대차정보,메모</div>
              <div>2024-01-15,마곡,오피스텔,매매,ABC빌딩,201호,500000000,2024-02-01,홍길동,010-1234-5678,,</div>
              <div>2024-01-20,발산,상업용,임대,XYZ빌딩,1층,0,2024-02-10,김영희,010-5555-6666,카페,</div>
            </div>

            <p className="font-bold mb-2">📝 주의사항:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              <li>건물명은 필수 (나머지는 선택사항)</li>
              <li>건물명은 미리 등록된 건물명과 일치해야 함</li>
              <li>금액은 숫자만 입력 (예: 500000000)</li>
              <li>날짜 형식은 YYYY-MM-DD (예: 2024-01-15)</li>
              <li>위치: 마곡, 발산, 향교, 나루, 신방화, 가양, 등촌, 공항, 화곡, 기타</li>
              <li>매물유형: 오피스텔, 상업용, 아파트, 지산, 기타</li>
              <li>구분: 매매 또는 임대</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4 border-t-2 border-amber-700">
            <MapleButton
              className="flex-1"
              onClick={handleParse}
              disabled={!file}
            >
              검증 및 미리보기
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
