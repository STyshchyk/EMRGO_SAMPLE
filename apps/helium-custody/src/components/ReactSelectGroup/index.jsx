import { components } from "react-select";

import style from "./style.module.scss";

const ReactSelectGroup = (props) => {
  return (
    <div className={style.selectContainer}>
      <components.Group {...props} />
    </div>
  );
};

export default ReactSelectGroup;
