import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  AlertTitle,
} from "@mui/material";

const DeleteSubmission = ({ submissionId, channelId, onDelete, onClose }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const debug = {
      submissionId,
      channelId,
      submissionIdType: typeof submissionId,
      channelIdType: typeof channelId,
      timestamp: new Date().toISOString(),
    };

    setDebugInfo(debug);

    if (!submissionId || !channelId) {
      console.warn("DeleteSubmission: Missing or invalid props", debug);
    }
  }, [submissionId, channelId]);

  const axiosInstance = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://babyjoy456.pythonanywhere.com/",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const validateProps = () => {
    const numSubmissionId = Number(submissionId);
    const numChannelId = Number(channelId);

    if (!submissionId || isNaN(numSubmissionId)) {
      throw new Error(`Invalid submissionId: ${submissionId}`);
    }
    if (!channelId || isNaN(numChannelId)) {
      throw new Error(`Invalid channelId: ${channelId}`);
    }
    return { numSubmissionId, numChannelId };
  };

  const handleClickOpen = () => {
    try {
      validateProps();
      setOpen(true);
      setError(null);
    } catch (err) {
      console.error("Validation failed:", err.message);
      setError(err.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleDelete = async () => {
    try {
      const { numSubmissionId, numChannelId } = validateProps();
      setIsDeleting(true);
      setError(null);

      const url = `/api/channels/${numChannelId}/submissions/${numSubmissionId}/`;
      const response = await axiosInstance.delete(url);

      if (response.status === 204) {
        if (onDelete) {
          onDelete(numSubmissionId); // This will trigger the update in the parent
        }
        handleClose();
        if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to delete submission. Please try again.";
      setError(errorMessage);
      console.error("Delete error:", {
        error: err.response || err,
        ...debugInfo,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (process.env.NODE_ENV === "development" && (!submissionId || !channelId)) {
    return (
      <Alert severity="error">
        <AlertTitle>Missing Required Props</AlertTitle>
        Please provide both submissionId and channelId
      </Alert>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={handleClickOpen}
        disabled={isDeleting}
        startIcon={<Trash2 />}
      >
        Delete Submission
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this submission? This action cannot
            be undone.
          </DialogContentText>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {process.env.NODE_ENV === "development" && (
            <pre
              style={{
                marginTop: "1rem",
                padding: "0.5rem",
                background: "#f5f5f5",
                borderRadius: "4px",
                fontSize: "0.75rem",
              }}
            >
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteSubmission;
