import React, { useEffect } from 'react';
import { FileText, ChevronRight, Menu } from 'lucide-react';

export default function Sider({ headings }) {
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Set a small delay to ensure the element is properly focused
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add a temporary highlight effect to help users spot the heading
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'; // Light blue highlight
        element.style.transition = 'background-color 2s ease';
        
        // Remove the highlight after 2 seconds
        setTimeout(() => {
          element.style.backgroundColor = originalBackground;
        }, 2000);
      }, 50);
    } else {
      console.warn(`Heading with ID "${id}" not found in document`);
    }
  };

  // Function to get heading icon and styling based on level
  const getHeadingProps = (level) => {
    switch(level) {
      case 'h1':
        return {
          indent: 'ml-0',
          size: 'text-sm font-semibold',
          dotColor: 'bg-blue-600',
          dotSize: 'w-3 h-3'
        };
      case 'h2':
        return {
          indent: 'ml-4',
          size: 'text-sm',
          dotColor: 'bg-blue-500',
          dotSize: 'w-2.5 h-2.5'
        };
      case 'h3':
        return {
          indent: 'ml-8',
          size: 'text-xs',
          dotColor: 'bg-blue-400',
          dotSize: 'w-2 h-2'
        };
      case 'h4':
        return {
          indent: 'ml-12',
          size: 'text-xs font-light',
          dotColor: 'bg-blue-300',
          dotSize: 'w-1.5 h-1.5'
        };
      default:
        return {
          indent: 'ml-0',
          size: 'text-sm',
          dotColor: 'bg-blue-600',
          dotSize: 'w-2 h-2'
        };
    }
  };

  // Add an effect to highlight active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Don't run if there are no headings
      if (!headings.length) return;
      
      // Get all heading elements that have IDs
      const headingElements = headings
        .map(h => document.getElementById(h.id))
        .filter(el => el !== null);
      
      if (!headingElements.length) return;
      
      // Find the heading that's currently at the top of the viewport
      let activeHeading = null;
      const scrollPosition = window.scrollY + 100; // Adding offset for better UX
      
      for (let i = 0; i < headingElements.length; i++) {
        const element = headingElements[i];
        const position = element.getBoundingClientRect().top + window.scrollY;
        
        if (position <= scrollPosition) {
          activeHeading = element;
        } else {
          break;
        }
      }
      
      // If we found an active heading, highlight it in the sidebar
      if (activeHeading) {
        // Remove active class from all buttons
        document.querySelectorAll('.sidebar-heading-btn').forEach(btn => {
          btn.classList.remove('bg-blue-50', 'text-blue-600');
        });
        
        // Add active class to corresponding button
        const activeBtn = document.querySelector(`.sidebar-heading-btn[data-id="${activeHeading.id}"]`);
        if (activeBtn) {
          activeBtn.classList.add('bg-blue-50', 'text-blue-600');
        }
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Call once on mount to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  return (
    <div className="w-64 bg-gray-50 border-r overflow-y-auto flex flex-col h-full">
      {/* Sider Header */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Menu size={18} className="mr-2 text-gray-600" />
            Document Outline
          </h2>
        </div>
        <p className="text-xs text-gray-500">Navigate through document sections</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {headings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4 bg-gray-100 rounded-lg border border-dashed border-gray-300">
            <FileText size={24} className="text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">No headings found</p>
            <p className="text-gray-400 text-xs mt-1">Add headings to see your document structure</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {headings.map(({ level, text, id }, i) => {
              const { indent, size, dotColor, dotSize } = getHeadingProps(level);
              
              return (
                <li key={i} className={`${indent} transition-all duration-150`}>
                  <button 
                    onClick={() => scrollToHeading(id)}
                    className={`sidebar-heading-btn ${size} group flex items-center py-1.5 px-2 text-gray-700 w-full text-left rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150`}
                    data-id={id}
                  >
                    <span className={`${dotSize} ${dotColor} rounded-full mr-2 flex-shrink-0`}></span>
                    <span className="truncate max-w-full">
                      {text || '(Untitled Heading)'}
                    </span>
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-blue-500" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 bg-gray-100 border-t text-center">
        <p className="text-xs text-gray-500">
          {headings.length} heading{headings.length !== 1 ? 's' : ''} in document
        </p>
      </div>
    </div>
  );
}