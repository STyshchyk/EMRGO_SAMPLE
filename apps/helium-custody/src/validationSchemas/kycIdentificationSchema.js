import * as Yup from "yup";

const kycIdentificationSchema = Yup.object().shape({
  entityName: Yup.string().nullable().required("Registered Name is required"),
  legalForm: Yup.string().required("Legal Form is required"),
  incorporationDate: Yup.string().nullable().required("Date of Incorporation is required"),
  incorporationPlace: Yup.string().nullable().required("Place of Incorporation is required"),
  tradingNames: Yup.array().of(Yup.string()).required("Required"),
  registeredAddress: Yup.object().shape({
    addressLine1: Yup.string().nullable().required("Address Line 1 is required"),
    addressLine2: Yup.string().nullable().required("Address Line 2 is required"),
    city: Yup.string().nullable().required("City is required"),
    country: Yup.string().nullable().required("Country is required"),
    pinCode: Yup.string().nullable().required("Post code is required"),
    businessPhone: Yup.string().nullable().required("Telephone is required"),
  }),
});

export default kycIdentificationSchema;
