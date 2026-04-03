// Composant modal de confirmation — remplace window.confirm()
// Réutilisable partout dans l'app
// Props :
//   - isOpen : booléen pour afficher/masquer la modal
//   - message : le texte affiché dans la modal
//   - onConfirm : fonction appelée quand on clique "Confirmer"
//   - onCancel : fonction appelée quand on clique "Annuler"
function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    // Si la modal n'est pas ouverte, on ne rend rien
    if (!isOpen) return null;

    return (
        // overlay = fond semi-transparent qui couvre toute la page
        <div className="modal-overlay" onClick={onCancel}>
            {/* stopPropagation = empêche le clic sur la modal de fermer l'overlay */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="btn-secondary">Annuler</button>
                    <button onClick={onConfirm} className="btn-danger">Confirmer</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
