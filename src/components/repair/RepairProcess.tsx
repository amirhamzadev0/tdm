import type { ProcessStep } from "@/models/content";

export function RepairProcess({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="process">
      {steps.map((step) => (
        <li key={step.number} className="process__step">
          <div className="process__number">{step.number}</div>
          <div className="process__title">{step.title}</div>
          <div className="process__text">{step.text}</div>
        </li>
      ))}
    </ol>
  );
}
