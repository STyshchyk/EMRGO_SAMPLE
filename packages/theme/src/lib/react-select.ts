export const selectStyles = (isDarkMode: boolean) => {
  return {
    menu: (styles: any) => ({
      ...styles,
      zIndex: 10,
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    control: (styles: any) => ({
      ...styles,
      border: "none",
      borderRadius: "6px",
      backgroundColor: "rgba(0, 0, 0, 0.09)",
      height: "2.5rem",
    }),
    singleValue: (styles: any, state: any) => ({
      ...styles,
      color: state.isDisabled ? "rgba(0, 0, 0, 0.38)" : "#23389c",
    }),
  };
};
