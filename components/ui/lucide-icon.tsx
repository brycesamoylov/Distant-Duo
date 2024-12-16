"use client";

import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

const LucideIcon = ({ name, ...props }: IconProps) => {
  console.log('Rendering icon:', name);
  const Icon = dynamic(dynamicIconImports[name]);
  return <Icon {...props} />;
};

export { LucideIcon }; 