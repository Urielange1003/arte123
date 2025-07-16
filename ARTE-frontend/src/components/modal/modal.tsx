import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Créez ce fichier CSS pour le style

const Modal = ({ isOpen, onClose, children, title }) => {
    const modalRef = useRef(null);

    // Effet pour empêcher le défilement du corps de la page lorsque la modale est ouverte
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus sur la modale pour l'accessibilité
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        // Nettoyage lors du démontage ou de la fermeture
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Effet pour fermer la modale avec la touche ESC
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    // Utilisation de ReactDOM.createPortal pour rendre la modale en dehors de la hiérarchie DOM normale
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique à l'intérieur
                ref={modalRef} // Référence pour le focus
                tabIndex="-1" // Permet au div d'être focusable
            >
                <div className="modal-header">
                    {title && <h2 id="modal-title">{title}</h2>}
                    <button className="modal-close-button" onClick={onClose} aria-label="Fermer la fenêtre modale">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body // Rend la modale directement dans le body
    );
};

export default Modal;