// import component
import inputNotes from "./inputInterface.mjs";

// fungsi untuk keluar dari process
const handleClose = () => {
  inputNotes.close();
  console.info("Anda telah keluar");
};

export default handleClose;
