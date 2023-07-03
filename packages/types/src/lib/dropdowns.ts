export interface IDropdown {
  id: string;
  name: string;
  nameAr: string;
  label: string;
  region: string;
  value: null | string | number;
  metadata: null;
  order: null;
  key: string;
  parentId: string;
  active: boolean;
  type: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IDropdownJoin {
  id: string;
  name: string;
  nameAr: string;
}

export interface IOption {
  label: string;
  value: any;
}
