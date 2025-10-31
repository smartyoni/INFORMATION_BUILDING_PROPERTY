export function MobileBottomNav({ onAction, currentTab, onTabChange }) {
  const navItems = [
    { id: 'buildings', label: '건물정보', icon: '🏢', action: 'buildings', isTab: true },
    { id: 'properties', label: '매물장', icon: '🏪', action: 'properties', isTab: true },
    { id: 'slot3', label: '3', icon: '3️⃣', action: 'slot3', disabled: true },
    { id: 'slot4', label: '4', icon: '4️⃣', action: 'slot4', disabled: true }
  ];

  const handleClick = (item) => {
    if (item.disabled) return;

    // 탭 전환인 경우 (건물정보/매물장)
    if (item.isTab && onTabChange) {
      onTabChange(item.action);
    } else {
      // 일반 액션 (추가, 임포트, 백업, 복원)
      onAction(item.action);
    }
  };

  // 현재 활성 탭 결정 (prop으로 제어되거나 기본값)
  const isActive = (item) => {
    if (item.isTab) {
      return currentTab === item.action;
    }
    return false;
  };

  return (
    <div className="maple-bottom-nav fixed bottom-0 left-0 right-0 w-full">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`maple-nav-item ${isActive(item) ? 'active' : ''} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleClick(item)}
        >
          <div className={`maple-nav-icon ${isActive(item) ? 'bg-amber-500' : ''}`}>
            {item.icon}
          </div>
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
