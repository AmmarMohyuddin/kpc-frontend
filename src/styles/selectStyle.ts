// src/styles/selectStyles.ts
export const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '50px',
    height: '50px',
    backgroundColor: "#F4F4F4",
    border: state.isFocused ? "1px solid #C32033" : "none",
    boxShadow: state.isFocused ? '0 0 0 1px #C32033' : provided.boxShadow,
    borderRadius: "0.50rem",
    '&:hover': {
      borderColor: state.isFocused ? '#C32033' : provided.borderColor,
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '50px',
    padding: '0 8px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#999999", // global placeholder color
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#FFD7D7'
      : state.isFocused
      ? '#FFD7D7'
      : provided.backgroundColor,
    color: '#000',
    '&:active': {
      backgroundColor: state.isSelected ? '#FFD7D7' : '#FFD7D7',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#C32033',
  }),
};
