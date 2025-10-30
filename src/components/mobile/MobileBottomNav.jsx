import { useState } from 'react';

export function MobileBottomNav({ onAction }) {
  const [activeTab, setActiveTab] = useState('buildings');

  const navItems = [
    { id: 'buildings', label: '건물정보', icon: '🏢', action: 'buildings' },
    { id: 'slot2', label: '2', icon: '2️⃣', action: 'slot2', disabled: true },
    { id: 'slot3', label: '3', icon: '3️⃣', action: 'slot3', disabled: true },
    { id: 'slot4', label: '4', icon: '4️⃣', action: 'slot4', disabled: true }
  ];

  const handleClick = (item) => {
    if (item.disabled) return;
    setActiveTab(item.id);
    onAction(item.action);
  };

  return (
    <div className="maple-bottom-nav fixed bottom-0 left-0 right-0 w-full">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`maple-nav-item ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleClick(item)}
        >
          <div className={`maple-nav-icon ${activeTab === item.id ? 'bg-amber-500' : ''}`}>
            {item.icon}
          </div>
          <span className="text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
