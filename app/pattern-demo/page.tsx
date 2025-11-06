'use client';

import React from 'react';

const PatternDemo = () => {
  const patterns = [
    {
      name: 'Original Pattern BG',
      className: 'pattern-bg',
      description: 'The current pattern background with grid lines',
    },
    {
      name: 'Globixs Geometric',
      className: 'globixs-geometric-pattern',
      description: 'Modern geometric blocks with primary and secondary colors',
    },
    {
      name: 'Globixs Hexagon',
      className: 'globixs-hexagon-pattern',
      description: 'Professional hexagon pattern for tech-forward sections',
    },
    {
      name: 'Globixs Wave',
      className: 'globixs-wave-pattern',
      description: 'Elegant wave pattern with gradient background',
    },
    {
      name: 'Globixs Circuit',
      className: 'globixs-circuit-pattern',
      description: 'Tech circuit pattern perfect for IT services',
    },
    {
      name: 'Globixs Mesh',
      className: 'globixs-mesh-pattern',
      description: 'Modern gradient mesh with brand colors',
    },
    {
      name: 'Globixs Dots',
      className: 'globixs-dots-pattern',
      description: 'Clean dots pattern with dual sizes',
    },
    {
      name: 'Globixs Diamond',
      className: 'globixs-diamond-pattern',
      description: 'Professional diamond pattern for hero sections',
    },
    {
      name: 'Globixs Grid Glow',
      className: 'globixs-grid-glow-pattern',
      description: 'Subtle grid with glow effect',
    },
    {
      name: 'Globixs Organic',
      className: 'globixs-organic-pattern',
      description: 'Abstract organic curves with gradient background',
    },
    {
      name: 'Globixs Tech Lines',
      className: 'globixs-tech-lines-pattern',
      description: 'Modern tech lines pattern for professional sections',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-globixs-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Globixs Pattern Alternatives
          </h1>
          <p className="text-xl text-globixs-textOnDark/80">
            Beautiful background patterns using your brand color palette
          </p>
        </div>
      </div>

      {/* Pattern Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Pattern Preview */}
              <div className={`${pattern.className} h-64 relative`}>
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-xl">
                    <h3 className="text-2xl font-bold text-globixs-primary mb-2">
                      {pattern.name}
                    </h3>
                    <p className="text-globixs-textLight">
                      {pattern.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pattern Info */}
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-globixs-text mb-2">
                      CSS Class:{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {pattern.className}
                      </code>
                    </h4>
                    <p className="text-globixs-textLight">
                      {pattern.description}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(pattern.className)
                    }
                    className="professional-button-secondary text-sm px-4 py-2"
                  >
                    Copy Class
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="mt-16 bg-globixs-bgAccent rounded-xl p-8">
          <h2 className="text-3xl font-bold text-globixs-primary mb-6">
            Usage Examples
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold text-globixs-text mb-3">
                Replace pattern-bg
              </h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {`<!-- Before -->
<section className="py-24 pattern-bg overflow-hidden">

<!-- After - Choose any pattern -->
<section className="py-24 globixs-geometric-pattern overflow-hidden">
<section className="py-24 globixs-hexagon-pattern overflow-hidden">
<section className="py-24 globixs-wave-pattern overflow-hidden">`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold text-globixs-text mb-3">
                Recommended Usage
              </h3>
              <ul className="space-y-2 text-globixs-textLight">
                <li>
                  <strong>Hero Sections:</strong> globixs-mesh-pattern,
                  globixs-wave-pattern
                </li>
                <li>
                  <strong>Service Sections:</strong> globixs-geometric-pattern,
                  globixs-hexagon-pattern
                </li>
                <li>
                  <strong>Tech/IT Content:</strong> globixs-circuit-pattern,
                  globixs-tech-lines-pattern
                </li>
                <li>
                  <strong>Testimonials:</strong> globixs-dots-pattern,
                  globixs-organic-pattern
                </li>
                <li>
                  <strong>Footer/Contact:</strong> globixs-grid-glow-pattern,
                  globixs-diamond-pattern
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold text-globixs-text mb-3">
                Color Palette Used
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-globixs-primary rounded"></div>
                  <span className="text-sm">Primary (#1e3a8a)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-globixs-secondary rounded"></div>
                  <span className="text-sm">Secondary (#0ea5e9)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-globixs-accent rounded"></div>
                  <span className="text-sm">Accent (#f97316)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-globixs-bgAccent rounded border"></div>
                  <span className="text-sm">Background (#eff6ff)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternDemo;
