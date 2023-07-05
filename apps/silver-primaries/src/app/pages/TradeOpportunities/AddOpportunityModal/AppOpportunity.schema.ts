import dayjs from "dayjs";
import * as Yup from "yup";

import { MIN_DATE } from "../../../utils";
import { opStatus } from "./AddOpportunity.types";

export const OpportunitySchema = Yup.object().shape({
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
  ideaEnd: Yup.date()
    .required("Start date is required")
    .test("is-status-idea, is-next-day", "Field must be greater than today", function(value) {
      //Test when statusId is not set = new opportunity, skip testing when status is open & closed
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValidDate = dayjs(MIN_DATE).startOf("day");
      if (statusId === opStatus.idea || statusId == null)
        return openEndDate >= minValidDate;
      else return true;
    })

  ,
  openEnd: Yup.date()
    .required("End date is required")
    .test("is-status-idea, is-next-day-after-idea, is-status-open", "Field must be greater than Idea End", function(value) {
      const { ideaEnd } = this.parent;
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValidDate = dayjs(ideaEnd).add(1, `day`);


      if ((statusId === opStatus.idea && statusId) || statusId == null)
        return openEndDate >= minValidDate;

      else return true;
    })
    .test("is-status-open", "Field must be greater than tomorrow", function(value) {
      const { statusId } = this.parent;
      const openEndDate = dayjs(value);
      const minValidDateTommorow = dayjs(MIN_DATE).startOf("day");
      if (statusId == null) return true;//TODO : To delete this

      if (statusId === opStatus.open)
        return openEndDate >= minValidDateTommorow;
      else return true;
    }),
  issuer: Yup.object().required("required"),
  sellSide: Yup.object().required("required"),
  csd: Yup.object().required("required")
});
