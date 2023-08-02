import * as Yup from "yup";

const bulletinFormSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  itemDate: Yup.date().required("Please select Bulletin date"),
  documentId: Yup.string(),
});

export default bulletinFormSchema;
