import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import FormControl from '@mui/material/FormControl';

import selectStyles from '../../styles/cssInJs/reactSelect';

const animatedComponents = makeAnimated();

const MaterialTableCustomDropdownRenderer = (props) => {
  const { value } = props;
  const options = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, data] of Object.entries(props.columnDef.lookup)) {
    const option = {
      value: key,
      label: data,
    };
    options.push(option);
  }

  const found = options.find((option) => option.value === value);

  return (
    <FormControl className="w-full">
      <Select
        closeMenuOnSelect
        placeholder="Select.."
        components={{
          ...animatedComponents,
        }}
        menuPortalTarget={document.body}
        isSearchable
        styles={selectStyles}
        value={value ? found : undefined}
        options={options}
        onChange={(selected) => {
          props.onChange(selected);
        }}
      />
    </FormControl>
  );
};

// MaterialTableCustomDropdownRenderer.propTypes = {
//   options: [
//     {
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       meta: {},
//     },
//   ],
// };

export default MaterialTableCustomDropdownRenderer;
