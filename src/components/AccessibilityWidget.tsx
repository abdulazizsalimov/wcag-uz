import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye, X, Sun, Moon, Monitor, Palette, Type, Volume2, ZoomIn,
  ChevronDown, ChevronRight, Settings, Play, Square, VolumeX, RotateCcw
} from 'lucide-react';

interface AccessibilityWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccessibilityWidget({ open, onOpenChange }: AccessibilityWidgetProps) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('wcag-uz-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'system';
  });

  const getActualTheme = useCallback((): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(getActualTheme);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    const root = document.documentElement;
    let effectiveTheme: 'light' | 'dark';
    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('wcag-uz-theme', newTheme);
    } else {
      effectiveTheme = newTheme;
      localStorage.setItem('wcag-uz-theme', newTheme);
    }
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setActualTheme(effectiveTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
        setActualTheme('dark');
      } else {
        root.classList.remove('dark');
        setActualTheme('light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Handle panel visibility and animation
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('panel-open');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (isVisible) {
      setIsAnimating(false);
      const scrollY = document.body.style.top;
      document.body.classList.remove('panel-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [open, isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const scrollY = document.body.style.top;
      document.body.classList.remove('panel-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (open && firstFocusableRef.current) {
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 350);
    }
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusableElements = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [open]);

  // Escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener('keydown', handleEscape, true);
      return () => document.removeEventListener('keydown', handleEscape, true);
    }
  }, [open, onOpenChange]);

  // Accessibility settings state
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('accessibility-font-size');
    return saved ? parseInt(saved) : 100;
  });

  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('accessibility-line-height');
    return saved ? parseInt(saved) : 100;
  });

  const [letterSpacing, setLetterSpacing] = useState(() => {
    const saved = localStorage.getItem('accessibility-letter-spacing');
    return saved ? parseInt(saved) : 100;
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('accessibility-high-contrast') === 'true';
  });

  const [grayscale, setGrayscale] = useState(() => {
    return localStorage.getItem('accessibility-grayscale') === 'true';
  });

  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('accessibility-large-text') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('accessibility-reduced-motion') === 'true';
  });

  const [textMagnifier, setTextMagnifier] = useState(() => {
    return localStorage.getItem('accessibility-text-magnifier') === 'true';
  });

  const [textToSpeech, setTextToSpeech] = useState(() => {
    return localStorage.getItem('accessibility-text-to-speech') === 'true';
  });

  const [speechSpeed, setSpeechSpeed] = useState(() => {
    const saved = localStorage.getItem('accessibility-speech-speed');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [showAdvancedFont, setShowAdvancedFont] = useState(false);
  const [showMagnifierSettings, setShowMagnifierSettings] = useState(false);
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [magnifierColorScheme, setMagnifierColorScheme] = useState(() => {
    const saved = localStorage.getItem('accessibility-magnifier-color-scheme');
    const userSet = localStorage.getItem('accessibility-magnifier-user-set') === 'true';
    if (!saved || !userSet) {
      return getActualTheme() === 'dark' ? 'black-white' : 'white-black';
    }
    return saved;
  });

  const [magnifierFontSize, setMagnifierFontSize] = useState(() => {
    return localStorage.getItem('accessibility-magnifier-font-size') || 'large';
  });

  // Apply functions
  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
    localStorage.setItem('accessibility-font-size', size.toString());
  };

  const applyLineHeight = (height: number) => {
    document.documentElement.style.setProperty('--line-height-multiplier', `${height / 100}`);
    localStorage.setItem('accessibility-line-height', height.toString());
  };

  const applyLetterSpacing = (spacing: number) => {
    document.documentElement.style.setProperty('--letter-spacing-multiplier', `${(spacing - 100) / 100}em`);
    localStorage.setItem('accessibility-letter-spacing', spacing.toString());
  };

  const toggleHighContrast = (enabled: boolean) => {
    document.documentElement.classList.toggle('high-contrast', enabled);
    localStorage.setItem('accessibility-high-contrast', enabled.toString());
  };

  const toggleGrayscale = (enabled: boolean) => {
    document.documentElement.classList.toggle('grayscale-mode', enabled);
    localStorage.setItem('accessibility-grayscale', enabled.toString());
  };

  const toggleLargeText = (enabled: boolean) => {
    document.documentElement.classList.toggle('large-text', enabled);
    localStorage.setItem('accessibility-large-text', enabled.toString());
  };

  const toggleReducedMotion = (enabled: boolean) => {
    document.documentElement.classList.toggle('reduce-motion', enabled);
    localStorage.setItem('accessibility-reduced-motion', enabled.toString());
  };

  const toggleTextMagnifier = (enabled: boolean) => {
    document.documentElement.classList.toggle('text-magnifier-enabled', enabled);
    localStorage.setItem('accessibility-text-magnifier', enabled.toString());
  };

  const toggleTextToSpeech = (enabled: boolean) => {
    setTextToSpeech(enabled);
    localStorage.setItem('accessibility-text-to-speech', enabled.toString());
    if (!enabled) {
      stopSpeech();
      setShowSpeechSettings(false);
    }
  };

  // Speech synthesis
  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const speakSelectedText = useCallback(async () => {
    if (!('speechSynthesis' in window)) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const textToRead = selectedText || document.title;

    if (!textToRead) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechSpeed;
    utterance.lang = document.documentElement.lang || 'uz';

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [speechSpeed]);

  // Update magnifier color scheme
  const updateMagnifierColorScheme = (scheme: string) => {
    setMagnifierColorScheme(scheme);
    localStorage.setItem('accessibility-magnifier-color-scheme', scheme);
    localStorage.setItem('accessibility-magnifier-user-set', 'true');
  };

  const updateMagnifierFontSize = (size: string) => {
    setMagnifierFontSize(size);
    localStorage.setItem('accessibility-magnifier-font-size', size);
  };

  // Apply saved settings on mount
  useEffect(() => {
    applyFontSize(fontSize);
    applyLineHeight(lineHeight);
    applyLetterSpacing(letterSpacing);
    if (highContrast) document.documentElement.classList.add('high-contrast');
    if (grayscale) document.documentElement.classList.add('grayscale-mode');
    if (largeText) document.documentElement.classList.add('large-text');
    if (reducedMotion) document.documentElement.classList.add('reduce-motion');
    if (textMagnifier) document.documentElement.classList.add('text-magnifier-enabled');
  }, []);

  // Text magnifier functionality
  useEffect(() => {
    if (!textMagnifier) return;

    let magnifierOverlay: HTMLDivElement | null = null;
    let magnifierContent: HTMLDivElement | null = null;
    let scrollTop = 0;

    const isValidTextElement = (el: HTMLElement): boolean => {
      const containerTags = ['HTML', 'BODY', 'DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'NAV', 'HEADER', 'FOOTER', 'UL', 'OL'];
      if (containerTags.includes(el.tagName)) return false;
      const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'LABEL', 'LI', 'TD', 'TH', 'TIME', 'STRONG', 'EM', 'CODE'];
      if (textTags.includes(el.tagName)) return true;
      const textNode = Array.from(el.childNodes).find(node =>
        node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );
      return !!textNode;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!e.shiftKey) {
        if (magnifierOverlay) {
          magnifierOverlay.remove();
          magnifierOverlay = null;
          magnifierContent = null;
          scrollTop = 0;
        }
        return;
      }

      const target = e.target as HTMLElement;
      if (!target || !isValidTextElement(target)) return;

      let textContent = '';
      const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BUTTON', 'LABEL', 'SPAN', 'LI', 'TD', 'TH', 'TIME', 'STRONG', 'EM', 'CODE'];
      if (textTags.includes(target.tagName)) {
        textContent = target.textContent?.trim() || '';
      } else {
        const directTextNodes = Array.from(target.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .filter(txt => txt);
        textContent = directTextNodes.join(' ');
      }

      if (!textContent) return;

      if (!magnifierOverlay) {
        const colorSchemes: Record<string, { bg: string; color: string; border: string }> = {
          'black-white': { bg: 'black', color: 'white', border: '#00bfff' },
          'white-black': { bg: 'white', color: 'black', border: '#333' },
          'sepia': { bg: '#f4f1e8', color: '#5c4b37', border: '#8b7355' },
          'light-blue': { bg: '#f0fbff', color: '#4285f4', border: '#4285f4' }
        };
        const fontSizes: Record<string, string> = { 'medium': '36px', 'large': '48px', 'very-large': '64px' };
        const currentScheme = colorSchemes[magnifierColorScheme] || colorSchemes['black-white'];
        const currentFontSize = fontSizes[magnifierFontSize] || fontSizes['large'];

        magnifierOverlay = document.createElement('div');
        magnifierOverlay.style.cssText = `
          position: fixed; background: ${currentScheme.bg}; border: 3px solid ${currentScheme.border};
          border-radius: 8px; z-index: 10000; pointer-events: none; max-width: 600px; max-height: 400px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5); display: flex; overflow: hidden;
        `;
        magnifierContent = document.createElement('div');
        magnifierContent.style.cssText = `
          color: ${currentScheme.color}; font-size: ${currentFontSize}; font-weight: bold;
          padding: 20px; word-wrap: break-word; overflow-y: auto; flex: 1;
        `;
        magnifierOverlay.appendChild(magnifierContent);
        document.body.appendChild(magnifierOverlay);
        scrollTop = 0;
      }

      const textNode = document.createTextNode(textContent);
      magnifierContent!.innerHTML = '';
      magnifierContent!.appendChild(textNode);
      magnifierContent!.scrollTop = scrollTop;

      const rect = magnifierOverlay.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 20;
      let left = e.clientX + margin;
      let top = e.clientY - rect.height - margin;
      if (left + rect.width > vw) left = e.clientX - rect.width - margin;
      if (left < 0) left = vw - rect.width - margin;
      if (top < 0) top = e.clientY + margin;
      if (top + rect.height > vh) top = vh - rect.height - margin;
      if (top < margin) top = margin;
      magnifierOverlay.style.left = `${left}px`;
      magnifierOverlay.style.top = `${top}px`;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey || !magnifierContent) return;
      e.preventDefault();
      scrollTop += e.deltaY;
      if (scrollTop < 0) scrollTop = 0;
      const maxScroll = magnifierContent.scrollHeight - magnifierContent.clientHeight;
      if (scrollTop > maxScroll) scrollTop = maxScroll;
      magnifierContent.scrollTop = scrollTop;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && magnifierOverlay) {
        magnifierOverlay.remove();
        magnifierOverlay = null;
        magnifierContent = null;
        scrollTop = 0;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keyup', handleKeyUp);
      if (magnifierOverlay) magnifierOverlay.remove();
    };
  }, [textMagnifier, magnifierColorScheme, magnifierFontSize]);

  // Floating speech button
  const FloatingSpeechButton = () => {
    const [selectedText, setSelectedText] = useState('');
    const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
    const [showBtn, setShowBtn] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (!textToSpeech) { setShowBtn(false); return; }
      const handleMouseUp = () => {
        setTimeout(() => {
          const sel = window.getSelection();
          const txt = sel?.toString().trim();
          if (txt && txt.length > 0) {
            setSelectedText(txt);
            const range = sel?.getRangeAt(0);
            if (range) {
              const rect = range.getBoundingClientRect();
              setButtonPos({
                x: Math.min(rect.right + 10, window.innerWidth - 120),
                y: rect.top - 50
              });
              setShowBtn(true);
            }
          } else {
            setShowBtn(false);
            setSelectedText('');
          }
        }, 10);
      };
      const handleScroll = () => setShowBtn(false);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('scroll', handleScroll, true);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }, [textToSpeech]);

    if (!showBtn || !textToSpeech) return null;

    return (
      <button
        ref={btnRef}
        onMouseDown={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isPlaying) {
            stopSpeech();
          } else if (selectedText) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(selectedText);
            utterance.rate = speechSpeed;
            utterance.lang = document.documentElement.lang || 'uz';
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
          }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl border border-blue-500 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
        style={{
          position: 'fixed',
          left: `${buttonPos.x}px`,
          top: `${buttonPos.y}px`,
          zIndex: 999999,
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
        title={isPlaying ? t('a11yPanel.speechStop') : t('a11yPanel.speechSpeak')}
      >
        {isPlaying ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    );
  };

  // Reset all settings
  const resetSettings = () => {
    setFontSize(100);
    setLineHeight(100);
    setLetterSpacing(100);
    setHighContrast(false);
    setGrayscale(false);
    setLargeText(false);
    setReducedMotion(false);
    setTextMagnifier(false);
    setTextToSpeech(false);
    setSpeechSpeed(1.0);
    setShowAdvancedFont(false);
    setShowMagnifierSettings(false);
    setShowSpeechSettings(false);
    stopSpeech();
    setMagnifierColorScheme(actualTheme === 'dark' ? 'black-white' : 'white-black');
    setMagnifierFontSize('large');

    document.documentElement.style.fontSize = '';
    document.documentElement.style.removeProperty('--line-height-multiplier');
    document.documentElement.style.removeProperty('--letter-spacing-multiplier');
    document.documentElement.classList.remove('high-contrast', 'grayscale-mode', 'large-text', 'reduce-motion', 'text-magnifier-enabled');

    const keys = [
      'accessibility-font-size', 'accessibility-line-height', 'accessibility-letter-spacing',
      'accessibility-high-contrast', 'accessibility-grayscale', 'accessibility-large-text',
      'accessibility-reduced-motion', 'accessibility-text-magnifier', 'accessibility-magnifier-color-scheme',
      'accessibility-magnifier-font-size', 'accessibility-magnifier-user-set', 'accessibility-text-to-speech',
      'accessibility-speech-speed'
    ];
    keys.forEach(k => localStorage.removeItem(k));
  };

  // Toggle switch component
  const Toggle = ({ checked, onChange, id, describedBy }: {
    checked: boolean; onChange: (v: boolean) => void; id: string; describedBy?: string;
  }) => (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // Range slider component
  const RangeSlider = ({ value, onChange, min, max, step, label, id }: {
    value: number; onChange: (v: number) => void; min: number; max: number; step: number; label: string; id: string;
  }) => (
    <div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        aria-label={label}
      />
    </div>
  );

  const panelContent = (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300"
          style={{ zIndex: 99998, filter: 'none', isolation: 'isolate', pointerEvents: 'auto' }}
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Side Panel */}
      <div
        ref={panelRef}
        className="accessibility-panel fixed top-0 right-0 h-full w-96 max-w-[90vw] border-l shadow-xl flex flex-col"
        style={{
          display: isVisible ? 'flex' : 'none',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: isAnimating ? 'translateX(0) translateZ(0)' : 'translateX(100%) translateZ(0)',
          transition: 'transform 300ms ease-in-out',
          zIndex: 99999,
          filter: 'none',
          isolation: 'isolate',
          backgroundColor: actualTheme === 'dark' ? '#111827' : '#ffffff',
          borderColor: actualTheme === 'dark' ? '#374151' : '#e5e7eb',
          color: actualTheme === 'dark' ? '#f9fafb' : '#111827',
          overflowY: 'auto',
          pointerEvents: 'auto'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
        aria-describedby="accessibility-description"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 id="accessibility-title" className="flex items-center gap-2 text-lg font-semibold">
            <Eye className="h-5 w-5" />
            {t('a11yPanel.title')}
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={t('a11yPanel.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div id="accessibility-description" className="sr-only">
          {t('a11yPanel.description')}
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6 flex-1 p-4 overflow-y-auto">
          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {theme === 'light' && <Sun className="h-4 w-4" />}
              {theme === 'dark' && <Moon className="h-4 w-4" />}
              {theme === 'system' && <Monitor className="h-4 w-4" />}
              <label className="font-medium text-sm">{t('a11yPanel.themeLabel')}</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Light */}
              <div className="text-center">
                <button
                  onClick={() => setTheme('light')}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 w-full ${
                    theme === 'light'
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  aria-label={t('a11yPanel.themeLight')}
                >
                  <div className="w-full h-16 rounded bg-white border border-gray-200 overflow-hidden">
                    <div className="h-3 bg-blue-50 border-b border-gray-200 flex items-center px-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-1" />
                      <div className="w-4 h-0.5 bg-gray-300 rounded" />
                    </div>
                    <div className="p-1 space-y-1">
                      <div className="w-full h-1 bg-blue-500 rounded" />
                      <div className="w-4/5 h-0.5 bg-gray-400 rounded" />
                      <div className="w-3/5 h-0.5 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1"><Sun className="h-3 w-3 text-yellow-500" /></div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('a11yPanel.themeLight')}</p>
              </div>
              {/* Dark */}
              <div className="text-center">
                <button
                  onClick={() => setTheme('dark')}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 w-full ${
                    theme === 'dark'
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  aria-label={t('a11yPanel.themeDark')}
                >
                  <div className="w-full h-16 rounded bg-gray-900 border border-gray-700 overflow-hidden">
                    <div className="h-3 bg-gray-800 border-b border-gray-700 flex items-center px-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mr-1" />
                      <div className="w-4 h-0.5 bg-gray-500 rounded" />
                    </div>
                    <div className="p-1 space-y-1">
                      <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded" />
                      <div className="w-4/5 h-0.5 bg-gray-400 rounded" />
                      <div className="w-3/5 h-0.5 bg-gray-500 rounded" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1"><Moon className="h-3 w-3 text-purple-400" /></div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('a11yPanel.themeDark')}</p>
              </div>
              {/* System */}
              <div className="text-center">
                <button
                  onClick={() => setTheme('system')}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 w-full ${
                    theme === 'system'
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  aria-label={t('a11yPanel.themeSystem')}
                >
                  <div className="w-full h-16 rounded border border-gray-300 overflow-hidden bg-gradient-to-b from-white via-gray-100 to-gray-900">
                    <div className="h-3 bg-gray-100 border-b border-gray-300 flex items-center px-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-1" />
                      <div className="w-4 h-0.5 bg-gray-400 rounded" />
                    </div>
                    <div className="h-8 bg-gradient-to-b from-white to-gray-900 flex items-center justify-center">
                      <div className="w-6 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded opacity-70" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1"><Monitor className="h-3 w-3 text-green-500" /></div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('a11yPanel.themeSystem')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('a11yPanel.themeHint')}</p>
          </div>

          {/* Grayscale */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <label htmlFor="grayscale" className="font-medium text-sm">{t('a11yPanel.grayscale')}</label>
              </div>
              <Toggle id="grayscale" checked={grayscale} onChange={(v) => { setGrayscale(v); toggleGrayscale(v); }} describedBy="grayscale-desc" />
            </div>
            <p id="grayscale-desc" className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('a11yPanel.grayscaleDesc')}</p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <label htmlFor="font-size" className="font-medium text-sm">{t('a11yPanel.fontSize')}: {fontSize}%</label>
              </div>
              <button
                onClick={() => setShowAdvancedFont(!showAdvancedFont)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={showAdvancedFont ? t('a11yPanel.hideAdvanced') : t('a11yPanel.showAdvanced')}
              >
                {showAdvancedFont ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
            <RangeSlider id="font-size" value={fontSize} onChange={(v) => { setFontSize(v); applyFontSize(v); }} min={75} max={150} step={25} label={`${t('a11yPanel.fontSize')} ${fontSize}%`} />
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('a11yPanel.fontSizeHint')}</p>

            {showAdvancedFont && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <label htmlFor="line-height" className="font-medium text-sm">{t('a11yPanel.lineHeight')}: {lineHeight}%</label>
                  </div>
                  <RangeSlider id="line-height" value={lineHeight} onChange={(v) => { setLineHeight(v); applyLineHeight(v); }} min={100} max={200} step={25} label={`${t('a11yPanel.lineHeight')} ${lineHeight}%`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <label htmlFor="letter-spacing" className="font-medium text-sm">{t('a11yPanel.letterSpacing')}: {letterSpacing}%</label>
                  </div>
                  <RangeSlider id="letter-spacing" value={letterSpacing} onChange={(v) => { setLetterSpacing(v); applyLetterSpacing(v); }} min={75} max={150} step={25} label={`${t('a11yPanel.letterSpacing')} ${letterSpacing}%`} />
                </div>
              </div>
            )}
          </div>

          {/* High Contrast */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <label htmlFor="high-contrast" className="font-medium text-sm">{t('a11yPanel.highContrast')}</label>
              </div>
              <Toggle id="high-contrast" checked={highContrast} onChange={(v) => { setHighContrast(v); toggleHighContrast(v); }} describedBy="hc-desc" />
            </div>
            <p id="hc-desc" className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('a11yPanel.highContrastDesc')}</p>
          </div>

          {/* Large Text */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <label htmlFor="large-text" className="font-medium text-sm">{t('a11yPanel.largeText')}</label>
              </div>
              <Toggle id="large-text" checked={largeText} onChange={(v) => { setLargeText(v); toggleLargeText(v); }} describedBy="lt-desc" />
            </div>
            <p id="lt-desc" className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('a11yPanel.largeTextDesc')}</p>
          </div>

          {/* Reduced Motion */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <label htmlFor="reduced-motion" className="font-medium text-sm">{t('a11yPanel.reducedMotion')}</label>
              </div>
              <Toggle id="reduced-motion" checked={reducedMotion} onChange={(v) => { setReducedMotion(v); toggleReducedMotion(v); }} describedBy="rm-desc" />
            </div>
            <p id="rm-desc" className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('a11yPanel.reducedMotionDesc')}</p>
          </div>

          {/* Text Magnifier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <label htmlFor="text-magnifier" className="font-medium text-sm">{t('a11yPanel.textMagnifier')}</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMagnifierSettings(!showMagnifierSettings)}
                  disabled={!textMagnifier}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={t('a11yPanel.magnifierSettings')}
                >
                  <Settings className="h-4 w-4" />
                </button>
                <Toggle id="text-magnifier" checked={textMagnifier} onChange={(v) => { setTextMagnifier(v); toggleTextMagnifier(v); if (!v) setShowMagnifierSettings(false); }} describedBy="tm-desc" />
              </div>
            </div>
            <p id="tm-desc" className="text-sm text-gray-500 dark:text-gray-400">{t('a11yPanel.textMagnifierDesc')}</p>

            {showMagnifierSettings && textMagnifier && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('a11yPanel.colorScheme')}</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { key: 'black-white', bg: 'bg-black', text: 'text-white', label: t('a11yPanel.schemeBlackWhite') },
                      { key: 'white-black', bg: 'bg-white', text: 'text-black', label: t('a11yPanel.schemeWhiteBlack') },
                      { key: 'sepia', bg: '', text: '', label: t('a11yPanel.schemeSepia') },
                      { key: 'light-blue', bg: '', text: '', label: t('a11yPanel.schemeBlue') },
                    ].map(s => (
                      <button
                        key={s.key}
                        className={`h-8 w-full border-2 rounded-md flex items-center justify-center font-bold text-sm transition-colors ${
                          magnifierColorScheme === s.key ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={
                          s.key === 'sepia' ? { backgroundColor: '#f4f1e8', color: '#5c4b37' }
                          : s.key === 'light-blue' ? { backgroundColor: '#f0fbff', color: '#4285f4' }
                          : s.key === 'black-white' ? { backgroundColor: 'black', color: 'white' }
                          : { backgroundColor: 'white', color: 'black' }
                        }
                        onClick={() => updateMagnifierColorScheme(s.key)}
                        aria-label={s.label}
                      >
                        T
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('a11yPanel.magnifierSize')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['medium', 'large', 'very-large'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => updateMagnifierFontSize(size)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          magnifierFontSize === size
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {t(`a11yPanel.magnifierSize_${size}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text to Speech */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <label htmlFor="text-to-speech" className="font-medium text-sm">{t('a11yPanel.textToSpeech')}</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSpeechSettings(!showSpeechSettings)}
                  disabled={!textToSpeech}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={t('a11yPanel.speechSettings')}
                >
                  <Settings className="h-4 w-4" />
                </button>
                <Toggle id="text-to-speech" checked={textToSpeech} onChange={toggleTextToSpeech} describedBy="tts-desc" />
              </div>
            </div>
            <p id="tts-desc" className="text-sm text-gray-500 dark:text-gray-400">{t('a11yPanel.textToSpeechDesc')}</p>

            {textToSpeech && (
              <div className="flex items-center gap-2">
                <button
                  onClick={speakSelectedText}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isPlaying ? (
                    <><Square className="h-4 w-4" /> {t('a11yPanel.speechPlaying')}</>
                  ) : (
                    <><Play className="h-4 w-4" /> {t('a11yPanel.speechSpeak')}</>
                  )}
                </button>
                {isPlaying && (
                  <button
                    onClick={stopSpeech}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <VolumeX className="h-4 w-4" /> {t('a11yPanel.speechStop')}
                  </button>
                )}
              </div>
            )}

            {showSpeechSettings && textToSpeech && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <label htmlFor="speech-speed" className="text-sm font-medium">{t('a11yPanel.speechSpeed')}: {speechSpeed.toFixed(1)}x</label>
                  <input
                    id="speech-speed"
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={speechSpeed}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSpeechSpeed(v);
                      localStorage.setItem('accessibility-speech-speed', v.toString());
                    }}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label={`${t('a11yPanel.speechSpeed')} ${speechSpeed.toFixed(1)}x`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={resetSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <RotateCcw className="h-4 w-4" />
            {t('a11yPanel.reset')}
          </button>
        </div>
      </div>

      {/* Floating Speech Button */}
      <FloatingSpeechButton />
    </>
  );

  // Create isolated container for panel
  useEffect(() => {
    let panelContainer = document.getElementById('accessibility-panel-container');
    if (!panelContainer) {
      panelContainer = document.createElement('div');
      panelContainer.id = 'accessibility-panel-container';
      panelContainer.style.cssText = `
        position: fixed !important; top: 0 !important; left: 0 !important;
        width: 100% !important; height: 100% !important; pointer-events: none !important;
        z-index: 999999 !important; filter: none !important; isolation: isolate !important;
      `;
      document.documentElement.appendChild(panelContainer);
    }
    return () => {
      const container = document.getElementById('accessibility-panel-container');
      if (container && !document.querySelector('.accessibility-panel')) {
        container.remove();
      }
    };
  }, []);

  const panelContainer = document.getElementById('accessibility-panel-container');
  return panelContainer ? createPortal(panelContent, panelContainer) : null;
}
