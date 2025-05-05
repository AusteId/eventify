import { useDarkMode } from './context/DarkModeContext.jsx';

const BasicModal = props => {
  const { isDarkMode } = useDarkMode();
  return (
    <dialog id={props.id} className="modal">
      <div className={`modal-box border ${isDarkMode ? "bg-slate-900 border-[#f59e0b]" : "border-transparent bg-white"} rounded-xl max-w-224`}>
        {props.children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BasicModal;
