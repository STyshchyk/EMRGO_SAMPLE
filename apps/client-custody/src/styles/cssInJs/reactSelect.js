const selectStyles = (isDarkMode) => {
  console.log("🚀 ~ file: reactSelect.js:2 ~ selectStyles ~ isDarkMode:", isDarkMode)
  return {
    menu: (styles) => ({
      ...styles,
      zIndex: 10,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (styles) => ({
      ...styles,
      border: "none",
      borderRadius: "6px",
      backgroundColor: "rgba(0, 0, 0, 0.09)",
      height: "3rem",
    }),
    singleValue: (styles, state) => ({
      ...styles,
      color: state.isDisabled ? "rgba(0, 0, 0, 0.38)" : "#23389c",
    }),
  };
};

export default selectStyles;
