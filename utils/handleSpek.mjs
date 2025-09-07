// import module
import os from "os";

// fungsi ambil spec device
const specification = () => {
  const systemSpecs = {
    osType: os.type(),
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
  };

  return systemSpecs;
};
// fungsi untuk memberikan informasi device pengguna
const handleSpek = () => {
  console.info(specification());
};

export default handleSpek;
