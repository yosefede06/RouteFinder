import L from 'leaflet';
import CategoryIcons from '../icons/categoryIcons';
import {createHideIconHtml, createIconHtml} from './utils';

export const getIconForCategory = (category, isGrayedOut = false) => {
  const iconOptions = CategoryIcons[category];

  if (!iconOptions) return L.divIcon(); // Default Leaflet icon if category not found
  const iconHtml = isGrayedOut ? createHideIconHtml(iconOptions.iconClass, "#d3d3d3") :
      createIconHtml(iconOptions.iconClass, iconOptions.color)
  // const color = isGrayedOut ? "#d3d3d3" : iconOptions.color;
  // const fontSize = isGrayedOut ? "15px" : '20px';

  return L.divIcon({
    className: iconOptions.className,
    html: iconHtml,
    iconSize: iconOptions.iconSize,
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor
  });
};