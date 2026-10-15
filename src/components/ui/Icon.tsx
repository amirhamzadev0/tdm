import {
  BatteryCharging,
  Cpu,
  HardDrive,
  Keyboard,
  MonitorSmartphone,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "battery-charging": BatteryCharging,
  cpu: Cpu,
  "hard-drive": HardDrive,
  keyboard: Keyboard,
  "monitor-smartphone": MonitorSmartphone,
  "shield-check": ShieldCheck,
};

interface IconProps {
  /** Lucide icon name stored in the data (kebab-case). Unknown names fall back to a wrench. */
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  const Component = icons[name] ?? Wrench;
  return <Component size={size} className={className} aria-hidden="true" />;
}
