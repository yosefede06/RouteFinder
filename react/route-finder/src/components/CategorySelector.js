import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon for rendering icons
import CategoryIcons from "../icons/categoryIcons";

const handleCategoryChange = (category, setCategories) => {
  setCategories((prev) =>
    prev.includes(category)
      ? prev.filter((cat) => cat !== category)
      : [...prev, category]
  );
};

const CategorySelector = ({ categories, categoryOptions, setCategories, disabled }) => {
  return (
    <div className="mt-3">
      <h6>Categories of Interest</h6>
      <div className="row g-2 g-lg-3 mt-2">
        {categoryOptions.map((category) => (
          <div className="col-4 col-md-4 col-lg-4" key={category}>
            <div
              className={`p-2 badge ${
                categories.includes(category) ? "bg-primary" : "bg-light text-dark"
              } d-flex align-items-center`}
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "5px 10px", // Reduce padding for more proportional size
                display: "inline-flex", // Adjust to fit the text content
                justifyContent: "flex-start", // Align content to the start
              }}
              onClick={() => !disabled && handleCategoryChange(category, setCategories)}
            >
              {CategoryIcons[category] && (
                <FontAwesomeIcon
                  icon={CategoryIcons[category].icon} // Render the FontAwesome icon
                  style={{
                    color: categories.includes(category)
                      ? "#fff"
                      : CategoryIcons[category].color,
                    fontSize: "16px", // Dynamically set size proportionate to the text
                    marginRight: "8px", // Adjust spacing between icon and text
                      marginLeft: "2px"
                  }}
                />
              )}
              {/* Dynamically set small class for small devices */}
              <span
                className="d-sm-inline d-md-none text-capitalize small" // Small class for small devices
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {category}
              </span>
              <span
                className="d-none d-md-inline text-capitalize" // Regular font size for larger devices
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;












//
// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import CategoryIcons from '../icons/categoryIcons';
//
// const handleCategoryChange = (category, setCategories) => {
//         setCategories((prev) => {
//                 return prev.includes(category)
//                     ? prev.filter((cat) => cat !== category)
//                     : [...prev, category]
//             }
//         );
// };
//
// const CategorySelector = ({ categories, categoryOptions, setCategories, disabled}) => {
//   return (
//
//     <div className="mt-2">
//       <h6>Categories of Interest</h6>
//       {categoryOptions.map((category) => (
//         <div className="form-check text-capitalize" key={category}>
//           {CategoryIcons[category] && (
//             <FontAwesomeIcon
//               icon={CategoryIcons[category].icon}
//               style={{
//                 color: CategoryIcons[category].color,
//                 fontSize: '15px',
//                 marginRight: '8px',
//               }}
//             />
//           )}
//           <input
//             className="form-check-input"
//             type="checkbox"
//             value={category}
//             checked={categories.includes(category)}
//             disabled={disabled}
//             onChange={() => handleCategoryChange(category, setCategories)}
//           />
//           <label className="form-check-label">{category}</label>
//         </div>
//       ))}
//     </div>
//   );
// };
//
// export default CategorySelector;