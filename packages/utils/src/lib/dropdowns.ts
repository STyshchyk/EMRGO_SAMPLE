import { IDropdown } from "@emrgo-frontend/types";

interface IAddAllDropdownRowParams {
  dropdown: IDropdown[];
  label?: string;
  value?: string | number;
}

interface INormaliseDropdownValuesParams {
  dropdown: IDropdown[];
  labelKey?: string;
  valueKey?: string;
}

export const addAllDropdownRow = ({
  dropdown,
  label = "All",
  value = "",
}: IAddAllDropdownRowParams) => {
  const allRow: IDropdown = {
    id: "",
    name: label,
    nameAr: label,
    label: label,
    region: "AE",
    value: value,
    metadata: null,
    order: null,
    key: "",
    parentId: "",
    active: true,
    type: "",
    createdAt: "",
    updatedAt: "",
  };

  const updatedDropdown = [allRow, ...dropdown];
  return updatedDropdown;
};

export const normaliseDropdownValues = ({
  dropdown,
  labelKey = "name",
  valueKey = "value",
}: INormaliseDropdownValuesParams) => {
  const normalisedDropdownValues = dropdown.map((row: IDropdown) => {
    const normalisedLabel = row[labelKey];
    const normalisedValue = row[valueKey];

    return {
      label: normalisedLabel,
      value: normalisedValue,
    };
  });
  return normalisedDropdownValues;
};
