export interface ICustomComponent {
  Option: React.ComponentType<any>;
  ValueContainer: React.ComponentType<any>;
}

export interface ISelectProps {
  components?: ICustomComponent;
  type?: TSelectType;
}

type TSelectType = "standard" | "filled";
