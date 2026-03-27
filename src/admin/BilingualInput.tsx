import { useState } from 'react';

interface BilingualInputProps {
  labelUz: string;
  labelRu: string;
  valueUz: string;
  valueRu: string;
  onChangeUz: (value: string) => void;
  onChangeRu: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  id: string;
}

export default function BilingualInput({
  labelUz, labelRu, valueUz, valueRu,
  onChangeUz, onChangeRu, multiline = false, required = false, id
}: BilingualInputProps) {
  const [activeLang, setActiveLang] = useState<'uz' | 'ru'>('uz');

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2" role="tablist" aria-label="Til tanlash / Выбор языка">
        <button
          type="button"
          role="tab"
          aria-selected={activeLang === 'uz'}
          aria-controls={`${id}-uz-panel`}
          onClick={() => setActiveLang('uz')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            ${activeLang === 'uz' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          O'zbekcha
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeLang === 'ru'}
          aria-controls={`${id}-ru-panel`}
          onClick={() => setActiveLang('ru')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            ${activeLang === 'ru' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Русский
        </button>
      </div>

      <div
        id={`${id}-uz-panel`}
        role="tabpanel"
        hidden={activeLang !== 'uz'}
        aria-labelledby={`${id}-uz-label`}
      >
        <label id={`${id}-uz-label`} htmlFor={`${id}-uz`} className="block text-sm font-medium text-gray-700 mb-1">
          {labelUz} <span className="text-gray-400">(O'zbekcha)</span>
        </label>
        {multiline ? (
          <textarea
            id={`${id}-uz`}
            value={valueUz}
            onChange={(e) => onChangeUz(e.target.value)}
            className={`${inputClass} min-h-[100px]`}
            required={required}
            rows={4}
          />
        ) : (
          <input
            id={`${id}-uz`}
            type="text"
            value={valueUz}
            onChange={(e) => onChangeUz(e.target.value)}
            className={inputClass}
            required={required}
          />
        )}
      </div>

      <div
        id={`${id}-ru-panel`}
        role="tabpanel"
        hidden={activeLang !== 'ru'}
        aria-labelledby={`${id}-ru-label`}
      >
        <label id={`${id}-ru-label`} htmlFor={`${id}-ru`} className="block text-sm font-medium text-gray-700 mb-1">
          {labelRu} <span className="text-gray-400">(Русский)</span>
        </label>
        {multiline ? (
          <textarea
            id={`${id}-ru`}
            value={valueRu}
            onChange={(e) => onChangeRu(e.target.value)}
            className={`${inputClass} min-h-[100px]`}
            required={required}
            rows={4}
          />
        ) : (
          <input
            id={`${id}-ru`}
            type="text"
            value={valueRu}
            onChange={(e) => onChangeRu(e.target.value)}
            className={inputClass}
            required={required}
          />
        )}
      </div>
    </div>
  );
}
