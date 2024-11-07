import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useRef } from "react";
import axios from "axios";

const UploadPSPopup = ({ channelId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [pStatement, setpStatement] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("submitted_work", selectedFile);
    formData.append("problem_statement", pStatement);

    try {
      let token = localStorage.getItem("token");
      const response = await axios.post(
        `https://babyjoy456.pythonanywhere.com/api/channels/${channelId}/submissions/submit/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // Ensure the token is correct
          },
        }
      );

      if (response.status === 201) {
        alert("File uploaded successfully!");
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(`Error: ${error.response.data.detail || "File upload failed"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from the server.");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
    });
    setSelectedFile(file);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          width: "800px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Share your Ideation
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Problem Statement"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          minRows={5}
          value={pStatement}
          onInput={(e) => {
            const target = e.target;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
            setpStatement(e.target.value);
            console.log("Problem statement updated:", e.target.value);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
            "& textarea": {
              overflow: "hidden",
              resize: "none",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleSelectedFile}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fileInputRef.current.click()}
            sx={{
              borderRadius: 20,
              padding: "8px 24px",
              backgroundColor: "#186F65",
              color: "white",
              alignSelf: "center",
              width: "500px",
            }}
          >
            {selectedFile ? selectedFile.name : "Upload File"}
          </Button>

          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={loading || !pStatement.trim() || !selectedFile}
            sx={{
              borderRadius: 20,
              padding: "8px 24px",
              backgroundColor: "#186F65",
              color: "white",
              alignSelf: "center",
              width: "500px",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Done"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UploadPSPopup;
