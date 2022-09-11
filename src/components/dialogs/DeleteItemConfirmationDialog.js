import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

const DeleteItemConfirmationDialog = ({ item, open, onCancel, onDone }) => {
    return (
        <Dialog open={open} onClose={onCancel} fullWidth>
            <DialogTitle>Supprimer un article</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Êtes-vous sûr de vouloir supprimer { item?.type === 'Bundle' ? 'le lot' : 'l\'article' } "{item?.name}" ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Annuler</Button>
                <Button onClick={() => onDone(item)}>Confirmer</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteItemConfirmationDialog;