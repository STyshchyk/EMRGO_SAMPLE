import { cyan, grey } from "@mui/material/colors";

import { colors } from "./colors";

export const themeStyles = (isDarkMode: boolean) => {
  return {
    palette: {
      mode: isDarkMode ? "dark" : "light",
      ...(isDarkMode
        ? {
            // palette values for dark mode
            primary: {
              main: colors.green5,
              contrastText: colors.black[100],
            },
            error: {
              main: "#eb0000",
              contrastText: "#fff",
            },
            divider: colors.strokes.dark,
            background: {
              default: colors.green1,
              paper: colors.green1,
            },
            text: {
              primary: colors.white[60],
              secondary: colors.white[40],
            },
          }
        : {
            primary: {
              main: colors.green3,
            },
            error: {
              main: "#eb0000",
              contrastText: "#fff",
            },
            background: {
              default: colors.white[100],
              paper: colors.white[100],
            },
            divider: colors.strokes.light,
            text: {
              primary: colors.black[80],
              secondary: colors.black[60],
            },
          }),
    },
    // shadows: ['none'],
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            // color: "#23389c",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "4px",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            "&:before": {
              display: "none",
            },
            marginBottom: "1rem",
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          content: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            "& p": {
              fontSize: "1.25rem",
              color: grey[500],
              fontWeight: 700,
            },
          },
          expandIcon: {
            color: cyan[500],
          },
          // root: {
          //   backgroundColor: "white!important",
          // },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.25rem",
            textarea: {
              padding: "0",
            },
          },
          input: {
            padding: "14px 12px",
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          underline: {
            "&:before": {
              display: "none",
            },
            "&:after": {
              display: "none",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.25rem",
            textarea: {
              padding: "0",
            },
          },
          input: {
            padding: "12px",
            fontSize: "1rem",
            fontWeight: 500,
          },
          underline: {
            "&:before": {
              display: "none",
            },
            "&:after": {
              display: "none",
            },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          positionStart: {
            marginTop: "1px!important",
            marginRight: "1px",
            marginLeft: "1px",
            marginBottom: "1px",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            transform: "translate(12px, 15px) scale(1) !important",
          },
          shrink: {
            transform: "translate(15px, 4px) scale(0.75) !important",
          },
          filled: {
            transform: "translate(12px, 12px) scale(1)",
            lineHeight: "1rem",
            fontSize: "14px",
            fontWeight: 500,
          },
          outlined: {
            lineHeight: "1rem",
            "&.MuiInputLabel-shrink": {
              transform: "translate(12px, -6px) scale(0.75)!important",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          filled: {
            padding: "10px",
            paddingRight: "100px!important",
            underline: {
              "&:before": {
                marginLeft: "3px",
                marginRight: "3px",
              },
              "&:after": {
                marginLeft: "3px",
                marginRight: "3px",
              },
            },
          },
          selectMenu: {
            zIndex: "1100",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: "none!important",
          },
          paperScrollPaper: {
            overflowY: "hidden",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {},
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "0.8rem",
          },
        },
      },
    },
    typography: {
      fontFamily: [
        "Inter",
        '"D-DIN Exp"',
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  };
};
