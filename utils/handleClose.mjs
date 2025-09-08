// import component
import inputNotes from "./inputInterface.mjs";

// fungsi untuk keluar dari aplikasi
const handleClose = () => {
  inputNotes.close();
  console.info("Anda telah keluar");
};

export default handleClose;
