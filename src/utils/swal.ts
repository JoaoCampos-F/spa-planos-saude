import Swal, { SweetAlertIcon } from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const toast = (param: { message: string; type: SweetAlertIcon }) => {
  return Swal.fire({
    text: param.message,
    icon: param.type,
    toast: true,
    position: "top-end",
    timerProgressBar: true,
    showConfirmButton: false,
    timer: 3500,
    width: 450,
  });
};

const confirm = async (title: string, text: string, icon: any) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, deletar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  });
};

export { toast, confirm };
