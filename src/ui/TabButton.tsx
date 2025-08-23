import React from "react";

type Props = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const TabButton = ({ active, onClick, children }: Props) => {
  return (
    <button
      className={`flex-1 py-2 ${
        active ? " bg-accent rounded-t-lg font-bold text-light " : "text-gray-500 cursor-pointer hover:text-accent"
      } transition-all duration-500`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TabButton;
