import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Modal,
    Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import ChannelCard from "./ChannelCard"; // Adjust the import path if necessary
import CreateChannelPopup from "../createchannelpopup/CreateChannelPopUP"; // Import the new component
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChannelListPopup = ({ open, onClose, roomId }) => {
    const navigate = useNavigate();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createChannelOpen, setCreateChannelOpen] = useState(false);

    useEffect(() => {
        const fetchChannels = async () => {
            let token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/rooms/${roomId}/channels`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setChannels(response.data);
            } catch (error) {
                console.error("Error fetching channels:", error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchChannels();
        }
    }, [open, roomId]);

    const handleDeleteChannel = async (channelId) => {
        let token = localStorage.getItem("token");
    
        try {
            await axios.delete(
                `http://localhost:8000/api/channels/${channelId}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            
            setChannels((prevChannels) =>
                prevChannels.filter((channel) => channel.id !== channelId)
            );
        } catch (error) {
            console.error("Error deleting channel:", error);
        }
    };
    
    const handleAddMemberToChannel = (channelId) => {
        // Open the add member dialog or perform actions to add a member
        console.log("Add member to channel:", channelId);
        // Implement your logic for adding a member, e.g., open a popup
    };
    
    const handleChannelClick = (channelId) => {
        navigate(`/channel/${channelId}`);
        onClose();
    };

    const handleAddChannel = () => {
        setCreateChannelOpen(true);
    };

    const handleCreateChannelClose = () => {
        setCreateChannelOpen(false);
    };

    const handleChannelCreated = (newChannel) => {
        setChannels((prevChannels) => [...prevChannels, newChannel]);
        handleCreateChannelClose();
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="channel-list-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: "column",
                        height: "70%",
                        position: "relative",
                    }}
                >
                    <Typography id="channel-list-title" variant="h6" align="center" gutterBottom>
                        Channels
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                            <CircularProgress />
                        </Box>
                    ) : channels.length === 0 ? (
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                color: "#888",
                                backgroundColor: "rgba(24, 111, 101, 0.05)",
                                borderRadius: "8px",
                                height: "70%",
                                padding: 4,
                            }}
                        >
                            <Typography variant="body2">
                                No channels available. Click 'Add Channel' to create one.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                            <List
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {channels.map((channel) => (
                                   <ListItem
                                   key={channel.id}
                                   sx={{
                                       backgroundColor: "rgba(24, 111, 101, 0.1)",
                                       borderRadius: "8px",
                                       width: "90%",
                                       marginBottom: "8px",
                                       padding: 0, // Remove extra padding for better card styling
                                   }}
                               >
                                   <ChannelCard
                                       title={channel.channel_name}
                                       onClick={() => handleChannelClick(channel.id)}
                                       onDelete={() => handleDeleteChannel(channel.id)}
                                       onAddMember={() => handleAddMemberToChannel(channel.id)}
                                   />
                               </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                   
                    <Box
                        sx={{
                            marginBottom: 3,
                            marginTop: 2,
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={onClose}
                            sx={{
                                borderRadius: "20px",
                                padding: "8px 24px",
                                backgroundColor: "#187569",
                                "&:hover": {
                                    backgroundColor: "#145c56",
                                },
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddChannel}
                            sx={{
                                borderRadius: "20px",
                                padding: "8px 24px",
                                backgroundColor: "#187569",
                                "&:hover": {
                                    backgroundColor: "#145c56",
                                },
                            }}
                        >
                            Channel
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Render CreateChannelPopup */}
            <CreateChannelPopup
                open={createChannelOpen}
                onClose={handleCreateChannelClose}
                roomId={roomId}
                onChannelCreated={handleChannelCreated}
            />
        </>
    );
};

export default ChannelListPopup;
