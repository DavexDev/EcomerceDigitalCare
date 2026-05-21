/**
 * lib/utils.js
 * 
 * Utilidades comunes, incluida la función `cn` para clsx/classnames
 */

export function cn(...classes) {
  return classes
    .filter((cls) => typeof cls === 'string' && cls.length > 0)
    .join(' ');
}
