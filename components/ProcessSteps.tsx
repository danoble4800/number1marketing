'use client';

import { motion } from 'framer-motion';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps: Step[];
}

export default function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark2">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-brand-near-black p-8"
        >
          <div className="font-display text-4xl text-brand-dark2 mb-4">{step.number}</div>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight mb-3">
            {step.title}
          </h3>
          <p className="text-brand-light1 text-sm leading-relaxed">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
