import React from 'react';

export interface Step {
  title: string;
  completed: boolean;
}

interface WizardSidebarProps {
  steps: Step[];
  currentStepIndex: number;
}

const WizardSidebar: React.FC<WizardSidebarProps> = ({ steps, currentStepIndex }) => {
  return (
    <aside className="w-full md:w-1/4 p-4 bg-gray-100 border-r">
      <h3 className="text-xl font-bold mb-4">Etapas do Processo</h3>
      <ul className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                index < currentStepIndex || step.completed
                  ? 'bg-green-500 text-white'
                  : index === currentStepIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {index + 1}
            </span>
            <span>{step.title}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default WizardSidebar;