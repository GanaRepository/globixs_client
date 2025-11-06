// components/ServiceDropdown.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Code, Package, Users, Settings, LineChart, Brain } from 'lucide-react';

const ServiceDropdown = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const serviceItems = [
    {
      icon: <Code className="w-5 h-5" />,
      title: 'IT Strategy & Architecture',
      description:
        'Integration solutions across data, applications, and processes',
      href: '/services/it-strategy-architecture',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Application Development',
      description: 'Custom software solutions from concept to delivery',
      href: '/services/application-development',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Technical Staff Augmentation',
      description: 'Skilled professionals to enhance your team',
      href: '/services/staff-augmentation',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Product Development',
      description: 'End-to-end product development services',
      href: '/services/product-development',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'DevOps',
      description: 'Streamlined development cycles and continuous delivery',
      href: '/services/devops',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      title: 'FinOps',
      description: 'Optimize cloud costs and maximize business value',
      href: '/services/finops',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'Custom AI Solutions',
      description: 'Intelligent applications powered by AI and ML',
      href: '/services/ai-solutions',
      color: 'from-fuchsia-500 to-pink-600',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Technology Consulting',
      description: 'Strategic guidance for digital transformation',
      href: '/services/technology-consulting',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const handleServiceClick = (href: string) => {
    setSelectedService(href);
    router.push(href);
  };

  return (
    <div className="absolute top-full left-0 w-96 mt-2 bg-white rounded-lg shadow-lg p-2 z-50">
      <div className="grid grid-cols-1 gap-1">
        {serviceItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleServiceClick(item.href)}
            className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm`}
            >
              {item.icon}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 group-hover:text-globixs-primary transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <Link
          href="/services"
          className="block text-center p-2 text-sm text-globixs-primary hover:text-globixs-secondary transition-colors"
        >
          View All Services
        </Link>
      </div>
    </div>
  );
};

export default ServiceDropdown;
