import dayjs from "dayjs";
import * as Yup from "yup";

import { MIN_DATE } from "../../../utils";

export const TradeTicketSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Issuer Name is Too Short!")
    .max(20, "Issuer Name is Too Long!")
    .required("Issuer Name is Required"),
  productDetails: Yup.string()
    .min(3, "Product Details is Too Short!")
    .max(20, "Product Details is Too Long!")
    .required("Product Details is Required"),
  productType: Yup.string()
    .min(3, "Product Type is Too Short!")
    .max(20, "Product Type is Too Long!")
    .required("Product Type is Required"),
  return: Yup.number()
    .min(0, "Value can't be nagative")
    .max(Infinity, "Value can't be that high")
    .required("Return value is Required"),
  amount: Yup.number()
    .min(0, "Value can't be nagative")
    .max(Infinity, "Value can't be that high")
    .required("Amount value is Required"),
  tenor: Yup.number()
    .min(0, "Value can't be nagative")
    .max(Infinity, "Value can't be that high")
    .required("Tenor value is Required"),
  isin: Yup.string()
    .min(3, "ISIN is Too Short!")
    .max(20, "ISIN is Too Long!")
    .required("ISIN is Required"),
  issueDate: Yup.date()
    .test("is-next-day", "Field must be greater than today", function(value) {
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValudDate = dayjs(MIN_DATE).startOf("day");

      if (statusId) return true;
      else return openEndDate >= minValudDate;
    })
    .required("Issue date is Required"),
  preOfferPeriodEnd: Yup.date()
    .test("is-next-day", "Field must be greater than today", function(value) {
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValudDate = dayjs(MIN_DATE).startOf("day");
      if (statusId) return true;
      else return openEndDate >= minValudDate;
    })
    .required("Pre-Offer date is Required"),
  offerPeriodEnd: Yup.date()
    .test("is-next-day", "Field must be greater than today", function(value) {
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValudDate = dayjs(MIN_DATE).startOf("day");
      if (statusId) return true;
      else return openEndDate >= minValudDate;
    })
    .required("Offer date is Required"),
  redemptionDate: Yup.date()
    .test("is-next-day", "Field must be greater than today", function(value) {
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValudDate = dayjs(MIN_DATE).startOf("day");
      if (statusId) return true;
      else return openEndDate >= minValudDate;
    })
    .required("Redemption date is Required"),


});
