import { faUtensils, faCoffee, faBed, faGasPump, faLandmark, faHotel, faGlassMartini } from '@fortawesome/free-solid-svg-icons';

const CategoryIcons = {
  restaurant: {
    className: 'custom-icon',
    iconClass: 'fas fa-utensils',
    icon: faUtensils,
    color: '#FF6F61',  // Restaurant color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  },
  cafe: {
    className: 'custom-icon',
    iconClass: 'fas fa-coffee',
    icon: faCoffee,
    color: '#F4D03F',  // Cafe color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  },
  hostel: {
    className: 'custom-icon',
    iconClass: 'fas fa-bed',
    icon: faBed,
    color: '#5DADE2',  // Hostel color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  },
  museum: {
    className: 'custom-icon',
    iconClass: 'fas fa-landmark',
    icon: faLandmark,
    color: '#48C9B0',  // Museum color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  },
  fuel: {
    className: 'custom-icon',
    iconClass: 'fas fa-gas-pump',
    icon: faGasPump,
    color: '#AF7AC5',  // Fuel color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  },
  hotel: {
    className: 'custom-icon',
    iconClass: 'fas fa-hotel',
    icon: faHotel,
    color: '#58D68D',  // Hotel color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  },
  bar: {
    className: 'custom-icon',
    iconClass: 'fas fa-glass-martini-alt',
    icon: faGlassMartini,
    color: '#8E44AD',  // Bar color
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  }
};

export default CategoryIcons;