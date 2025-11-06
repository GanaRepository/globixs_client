import React from 'react';

// Export the interface so it can be imported elsewhere if needed
export interface QuoteSectionProps {
  quote: string;
  author: string;
  role?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({
  quote,
  author,
  role,
  bgColor = 'bg-globixs-bgAccent',
  textColor = 'text-globixs-text',
  accentColor = 'text-globixs-primary',
}) => {
  // Extract the base color for opacity variants
  const accentBaseColor = accentColor.startsWith('text-')
    ? accentColor.replace('text-', '')
    : 'globixs-primary';

  return (
    <section className={`section-padding ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-16 w-16 text-globixs-primary/20 mx-auto mb-6`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <p
            className={`text-lead ${textColor} italic font-light leading-relaxed mb-6`}
          >
            {quote}
          </p>

          <div className={`w-20 h-1 bg-globixs-primary/30 mx-auto mb-6`}></div>

          <p className={`text-lg font-semibold ${accentColor}`}>{author}</p>

          {role && (
            <p className={`text-base text-globixs-textLight mt-1`}>{role}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
