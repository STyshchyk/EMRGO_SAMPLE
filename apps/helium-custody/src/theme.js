import { cyan, grey } from "@mui/material/colors";

export default {
  palette: {
    primary: {
      main: "#23389c",
      dark: "#1a2972",
      contrastText: "#fff",
    },
    error: {
      main: "#eb0000",
      contrastText: "#fff",
    },
    secondary: {
      main: "#28ccbf",
      contrastText: "#fff",
    },
  },
  // shadows: ['none'],
  shape: {
    borderRadius: 6,
  },
  overrides: {
    MuiPaper: {
      root: {
        color: "#23389c",
      },
    },
    MuiButton: {
      root: {
        borderRadius: "4px",
      },
    },
    MuiAccordion: {
      root: {
        "&:before": {
          display: "none",
        },
      },
    },
    MuiToolbar: {
      root: {
        color: "#23389c",
        backgroundColor: "#ffffff",
      },
    },
    MuiAccordionSummary: {
      content: {
        "& p": {
          fontSize: "1.25rem",
          color: grey[500],
          fontWeight: 700,
        },
      },
      expandIcon: {
        color: cyan[500],
      },
      root: {
        backgroundColor: "white!important",
      },
    },
    MuiFilledInput: {
      root: {
        borderRadius: "6px",
      },
      input: {
        padding: "24px 8px",
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
    MuiInputAdornment: {
      positionStart: {
        marginTop: "1px!important",
        marginRight: "1px",
        marginLeft: "1px",
        marginBottom: "1px",
      },
    },
    MuiInputLabel: {
      shrink: {
        transform: "translate(12px, 4px) scale(0.75)!important",
      },
      filled: {
        transform: "translate(12px, 15px) scale(1)",
      },
    },
    MuiSelect: {
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
    MuiDialog: {
      paperScrollPaper: {
        overflowY: "hidden",
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "0.8rem",
      },
    },
  },
  typography: {
    fontFamily: [
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
