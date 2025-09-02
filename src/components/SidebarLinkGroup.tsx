// import { ReactNode, useState } from 'react';

// interface SidebarLinkGroupProps {
//   children: (handleClick: () => void, open: boolean) => ReactNode;
//   activeCondition: boolean;
// }

// const SidebarLinkGroup = ({
//   children,
//   activeCondition,
// }: SidebarLinkGroupProps) => {
//   const [open, setOpen] = useState<boolean>(activeCondition);

//   const handleClick = () => {
//     setOpen(!open);
//   };

//   return <li>{children(handleClick, open)}</li>;
// };

import { ReactNode } from "react";

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
  open: boolean;
  onToggle: () => void;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
  open,
  onToggle,
}: SidebarLinkGroupProps) => {
  const handleClick = () => {
    onToggle();
  };

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;

