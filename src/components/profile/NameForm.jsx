import { inject, observer } from 'mobx-react'
import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const NameForm = inject('user')(observer((props) => {
    const { user } = props
    const [fields, setFields] = useState({
        firstName: user.firstName,
        lastName: user.lastName
    })


    const handleClose = () => {
        props.setOpen(false);
    };
    
    const handleSubmit = () => {
        handleClose()
        props.handleSubmit();
    };

    const genenrateFields = () => {
        const fieldsArray = []
        for (let f of props.fields) {
            fieldsArray.push(
                <TextField
                    autoFocus
                    margin="dense"
                    name={f.name}
                    key={f.id}
                    label={f.label}
                    type={f.type}
                    fullWidth
                    value={f.value}
                    onChange={props.handleFieldChange}
                />
            )
        }
        return fieldsArray
    }

    return (
    <div>
    <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update Personal Details</DialogTitle>
      <DialogContent>
        {genenrateFields()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  </div>
    )

}))

export default NameForm