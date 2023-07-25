import * as Yup from "yup";

Yup.setLocale({
  mixed: {
    required: ({ path }) => ({ transKey: `yup:mixed.required.${path}` }),
    oneOf: ({ path }) => ({
      transKey: `yup:mixed.oneOf.${path}`,
    }),
  },
  string: {
    email: () => ({ transKey: "yup:string.email" }),
    min: ({ min }) => ({ transKey: "yup:string.minLength", options: { count: min } }),
    max: ({ max }) => ({ transKey: "yup:string.maxLength", options: { count: max } }),
    matches: ({ path }) => ({ transKey: `yup:string.matches.${path}` }),
  },
});
