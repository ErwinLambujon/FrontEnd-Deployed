import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

const DeleteAllSubmissions = ({ setPosts, channelId }) => {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  const axiosInstance = axios.create({
    baseURL: "https://babyjoy456.pythonanywhere.com/",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
    setError(null);
    setProgress(0);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setProgress(0);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await axiosInstance.get(`/api/channels/${channelId}/submissions/`);
      const submissions = response.data;
      const totalSubmissions = submissions.length;

      for (let i = 0; i < submissions.length; i++) {
        const submission = submissions[i];
        await axiosInstance.delete(`/api/channels/${channelId}/submissions/${submission.id}/`);

        setProgress(Math.round(((i + 1) / totalSubmissions) * 100));
      }

      setPosts([]);
      handleClose();
    } catch (err) {
      setError("Failed to delete submissions. Please try again.");
      console.error("Error deleting submissions:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleClickOpen}
        startIcon={<AlertCircle />}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete All Submissions"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you absolutely sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. This will permanently delete all
            submissions from this channel.
          </DialogContentText>
          
          {isDeleting && (
            <div style={{ marginTop: '1rem' }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                color="error"
              />
              <DialogContentText style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                {progress}% Complete
              </DialogContentText>
            </div>
          )}
          
          {error && (
            <DialogContentText 
              style={{ 
                marginTop: '1rem', 
                color: '#d32f2f'
              }}
            >
              {error}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? `Deleting (${progress}%)...` : "Delete All"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteAllSubmissions;