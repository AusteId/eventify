const FieldValidationError = ({ children }) => {
  return (
    <div className="pl-4 mt-0.5 absolute text-red-600 drop-shadow-lg max-w-92 text-[0.75rem]/[0.875rem]">{children}</div>
  );
};
export default FieldValidationError;
