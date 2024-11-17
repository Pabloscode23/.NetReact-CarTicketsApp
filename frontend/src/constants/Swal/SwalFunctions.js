// swalUtils.js
import Swal from 'sweetalert2';
import './SwalStyles.css';
// Base styles configuration for SweetAlert2
const baseSwalConfig = {
    customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
    },
    background: '#f9fafb',
    color: '#333',
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
};

// Function to show a success alert
export const showSuccessAlert = (title = 'Success', text = '') => {
    Swal.fire({
        ...baseSwalConfig,
        title,
        text,
        icon: 'success',
        iconColor: '#48bb78' // Customize success icon color
    });
};

// Function to show an error alert
export const showErrorAlert = (title = 'Error', text = '') => {
    Swal.fire({
        ...baseSwalConfig,
        title,
        text,
        icon: 'error',
        iconColor: '#e53e3e' // Customize error icon color
    });
};
