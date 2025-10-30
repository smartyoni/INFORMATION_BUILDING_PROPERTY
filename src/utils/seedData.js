export async function seedInitialData(db) {
  try {
    // 기존 데이터 확인
    const existing = await db.getAll();

    if (existing.length === 0) {
      // 데이터가 없으면 아무것도 하지 않음
      console.log('✓ 데이터베이스가 비어있습니다');
      return false;
    } else {
      console.log(`✓ 기존 데이터 ${existing.length}개가 있습니다`);
      return false;
    }
  } catch (err) {
    console.error('데이터 확인 실패:', err);
    return false;
  }
}
