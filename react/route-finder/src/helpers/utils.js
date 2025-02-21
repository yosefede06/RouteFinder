import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as faEmptyStar, faStar, faStarHalfAlt} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const darkenColor = (hex, percent) => {
  const darken = (channel) => Math.floor(parseInt(channel, 16) * (1 - percent / 100))
      .toString(16)
      .padStart(2, '0');

  return `#${darken(hex.slice(1, 3))}${darken(hex.slice(3, 5))}${darken(hex.slice(5, 7))}`;
};

export const createIconHtml = (iconClass, color, fontSize='20px') => {
  const shadowColor = darkenColor(color, 40);  // Darken by 40%
  return `<i class='${iconClass}' style='color:${color}; font-size:${fontSize}; text-shadow: 2px 2px 5px ${shadowColor};'></i>`;
};

// Function to render stars based on the rating (0-10 scale, mapped to 5 stars)
export const renderRatingStars = (rating) => {
    // Map 0-10 rating to 0-5 stars
    const starRating = Math.max(0, Math.min(5, (rating || 0) / 2));
    console.log(starRating)
    const fullStars = Math.floor(starRating);
    console.log(fullStars)
    const halfStar = starRating % 1 >= 0.5 ? 1 : 0;
    console.log(halfStar)
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div className="rating-stars" style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(fullStars)].map((_, idx) => (
          <FontAwesomeIcon key={`full-${idx}`} icon={faStar} style={{ color: '#FFD700', marginRight: '2px' }} />
        ))}
        {halfStar === 1 && (
          <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: '#FFD700', marginRight: '2px' }} />
        )}
        {[...Array(emptyStars)].map((_, idx) => (
          <FontAwesomeIcon key={`empty-${idx}`} icon={faEmptyStar} style={{ color: '#e4e5e9' , marginRight: '2px' }} />
        ))}
      </div>
    );
  };

export const createHideIconHtml = (iconClass, color, fontSize='15px') => {
  return `<i class='${iconClass}' style='color:${color}; font-size:${fontSize}'></i>`;
};
// utils.js or in your POIInfoPanel component file
export const isOpenNow = (operatingHours) => {
  if (!operatingHours) return false; // If no operating hours are provided, assume closed
  // Get the current day and time
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon", "Tue"
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // Convert to minutes since midnight
    if (operatingHours.length > 0 && operatingHours[0].day?.includes("7\\24")) return true;
  // Find today's hours in the operatingHours array
  const todayHours = operatingHours.find((entry) => entry.day.startsWith(currentDay));

  if (!todayHours) return false; // If no hours are specified for today, assume closed

  // Parse the opening and closing hours
  const [open, close] = todayHours.hours.split('-').map((time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute; // Convert to minutes since midnight
  });

  // Check if current time is within the open and close times
  return currentTime >= open && currentTime <= close;
};
// Helper function to calculate the distance between two points
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

