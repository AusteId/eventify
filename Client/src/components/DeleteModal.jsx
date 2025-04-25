import { useDarkMode } from './context/DarkModeContext.jsx';
import Button from './Button.jsx';
import DefaultImage from "../assets/no-image.png"

const DeleteModal = ({
  closeModal,
  name = 'this',
  warningMessage = `Are you sure you want to delete ${name}`,
  buttonCancel = 'Cancel',
  buttonAccept = 'Delete',
  api = null,
  onClick = null
}) => {
  const { isDarkMode } = useDarkMode();

  const handleClick = e => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={closeModal}
      className="fixed z-50 bg-black/50 inset-0 flex justify-center items-center"
    >
      <div
        onClick={handleClick}
        className={`duration-750 border rounded-2xl flex justify-center flex-col p-10 ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'}`}
      >
        <p className={`text-xl duration-750 text-center pb-6 ${isDarkMode ? "text-[#f59e0b]" : "text-header-darker"}`}>{warningMessage} {name}?</p>
        {api !== null && <div className="flex justify-center items-center pb-6"> <img className={"rounded-2xl w-40 "} src={`http://localhost:8080${api}`} alt={"image"} onError={(e) => {
          e.target.onerror = null
          e.target.src = DefaultImage;
        }} /> </div>}

        <div className="flex justify-between">
        <Button
          type="button"
          onClick={closeModal}
          hoverColor={"hover:bg-slate-600 duration-750 "}
          textColor={"text-white"}
          size={"large"}
          background={`bg-slate-900`}
          border={`border ${isDarkMode ? "border-[#f59e0b]" : "border-transparent"}`}
        >
          {buttonCancel}
        </Button>
        <Button
          onClick={onClick}
          size="large"
          className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg text-white"
        >
          {buttonAccept}
        </Button>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
