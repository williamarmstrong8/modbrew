import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.trim().toUpperCase();
    
    // Ensure # prefix
    if (!newValue.startsWith('#')) {
      newValue = '#' + newValue;
    }
    
    // Remove any non-hex characters after the #
    newValue = newValue.slice(0, 1) + newValue.slice(1).replace(/[^0-9A-F]/g, '');
    
    // Limit to 7 characters (# + 6 hex digits)
    newValue = newValue.slice(0, 7);
    
    setInputValue(newValue);
    
    // Only update if it's empty, just #, or a valid hex color
    if (newValue === '' || newValue === '#' || /^#[0-9A-F]{1,6}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure the color is valid on blur
    if (inputValue && inputValue !== '#' && /^#[0-9A-F]{6}$/.test(inputValue)) {
      onChange(inputValue);
    } else {
      setInputValue(value); // Reset to original value if invalid
    }
  };

  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#F9E79F', '#ABEBC6', '#FAD7A0', '#AED6F1', '#D5A6BD'
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-2 hover:border-gray-400 transition-colors"
            style={{ 
              backgroundColor: value || '#FFFFFF',
              opacity: disabled ? 0.5 : 1 
            }}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open color picker</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Choose Color</Label>
              <div className="mt-2">
                <input
                  ref={inputRef}
                  type="color"
                  value={value}
                  onChange={handleColorChange}
                  className="w-full h-10 rounded border cursor-pointer"
                  disabled={disabled}
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Hex Code</Label>
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="font-mono mt-1"
                placeholder="#RRGGBB"
                disabled={disabled}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Preset Colors</Label>
              <div className="mt-2 grid grid-cols-10 gap-1">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setInputValue(color);
                    }}
                    disabled={disabled}
                    title={color}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Input 
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="font-mono"
        placeholder="#RRGGBB"
        disabled={disabled}
      />
    </div>
  );
};

export { ColorPicker };
