'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface PortfolioItem {
  name: string;
  url: string;
  displayUrl: string;
  screenshot: string;
  niche: string;
  description: string;
  tags: string[];
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    name: 'Noble Home Service',
    url: 'https://www.noblehomeservicema.com/',
    displayUrl: 'noblehomeservicema.com',
    screenshot: '/noble-home-service-screenshot.jpg',
    niche: 'Home Services',
    description:
      'High-converting local service website built for a Massachusetts home service company. Designed to dominate local search and turn every visitor into a booked job.',
    tags: ['Local SEO', 'Lead Generation', 'Mobile-First', 'Web Design'],
  },
];

interface PortfolioSectionProps {
  heading: string;
  subheading: string;
  nicheLabel: string;
  viewSite: string;
}

export default function PortfolioSection({
  heading,
  subheading,
  nicheLabel,
  viewSite,
}: PortfolioSectionProps) {
  return (
    <section className="bg-brand-near-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{nicheLabel}</p>
          <h2 className="font-display text-5xl lg:text-7xl text-brand-white tracking-tight leading-none">
            {heading}
          </h2>
          <p className="mt-6 text-brand-light1 text-lg max-w-2xl mx-auto">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <motion.div
              key={item.url}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group flex flex-col"
            >
              {/* Browser chrome */}
              <div className="border border-brand-dark2 bg-brand-dark1 overflow-hidden flex-1">
                <div className="bg-brand-dark2 border-b border-brand-dark2 px-4 py-2.5 flex items-center gap-3">
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 bg-brand-near-black rounded-sm px-3 py-1 flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 flex-shrink-0 opacity-40">
                      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1a5 5 0 100 10A5 5 0 006 1z" stroke="#B9B9BE" strokeWidth="1" />
                        <path d="M6 1c-1.5 2-2 3.5-2 5s.5 3 2 5" stroke="#B9B9BE" strokeWidth="1" />
                        <path d="M6 1c1.5 2 2 3.5 2 5s-.5 3-2 5" stroke="#B9B9BE" strokeWidth="1" />
                        <path d="M1.5 4.5h9M1.5 7.5h9" stroke="#B9B9BE" strokeWidth="1" />
                      </svg>
                    </div>
                    <span className="text-xs text-brand-light1 truncate">{item.displayUrl}</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-brand-mid hover:text-brand-light2 transition-colors"
                    aria-label={`Visit ${item.name}`}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* Screenshot */}
                <div className="relative overflow-hidden" style={{ paddingBottom: '62.5%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.screenshot}
                    alt={`${item.name} website screenshot`}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* subtle overlay on hover */}
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Card info below mockup */}
              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-brand-mid mb-1">{item.niche}</p>
                  <h3 className="text-brand-white font-semibold text-xl leading-snug">{item.name}</h3>
                  <p className="mt-2 text-brand-light1 text-sm leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 border border-brand-dark2 text-brand-light1 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs uppercase tracking-widest text-brand-light2 hover:text-brand-white transition-colors font-semibold mt-1"
                >
                  {viewSite}
                  <ExternalLink size={11} />
                </a>
              </div>
            </motion.div>
          ))}

          {/* Coming soon card — fills the grid when there's an odd number of items */}
          {PORTFOLIO_ITEMS.length % 2 !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: PORTFOLIO_ITEMS.length * 0.12 }}
              className="border border-dashed border-brand-dark2 flex items-center justify-center min-h-[300px]"
            >
              <div className="text-center px-8">
                <p className="font-display text-3xl text-brand-dark2 tracking-widest">YOUR NICHE</p>
                <p className="text-brand-mid text-sm mt-3 max-w-xs">
                  Every industry. Every business size. We build conversion-first websites that actually rank and convert.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
