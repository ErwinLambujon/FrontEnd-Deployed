import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";

import PSCard from "../components/PSCard";
import PopupVennHistory from "../components/popupcards/vennHistorypopup/vennHistoryPopUp";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import WhysCard from "../components/WhysCard";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const FiveWhys = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [fiveWhys, setFiveWhys] = useState(
    JSON.parse(sessionStorage.getItem("five_whys")) || []
  );
  const [selectedWhys, setSelectedWhys] = useState(
    JSON.parse(sessionStorage.getItem("selected_whys")) || []
  );
  const navigate = useNavigate();

  const generateFiveWhys = async (statement) => {
    setIsLoading((prev) => !prev);
    try {
      let token = localStorage.getItem("token");
      let response = await axios.post(
        "https://babyjoy456.pythonanywhere.com/api/ai/five_whys/",
        {
          ranked_problem: statement,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setFiveWhys((prev) => [...response.data.response]);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading((prev) => !prev);
    }
  };
  const statement =
    location.state?.statement ||
    sessionStorage.getItem("whys_selected_statement") ||
    "";

  const venn = location.state?.venn ||
    JSON.parse(sessionStorage.getItem("whys_venn")) || {
      field1: "",
      field2: "",
      field3: "",
    };

  const statement_id = location.state?.id || null;

  useEffect(() => {
    sessionStorage.setItem("whys_selected_statement", statement);
    sessionStorage.setItem("whys_venn", JSON.stringify(venn));
    sessionStorage.setItem("selected_whys", JSON.stringify(selectedWhys));
    sessionStorage.setItem("five_whys", JSON.stringify(fiveWhys));
    sessionStorage.setItem("statement_id", statement_id);
  }, [statement, venn, selectedWhys, fiveWhys, statement_id]);

  const handleShowPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const addWhysToList = (why) => {
    if (selectedWhys !== null) {
      if (!selectedWhys.includes(why)) {
        return setSelectedWhys((curr) => [...curr, why]);
      } else {
        return setSelectedWhys(selectedWhys.filter((whys) => whys !== why));
      }
    }
    return setSelectedWhys((prev) => [...prev, ...why]);
  };

  // NOTE: Only used for debugging purposes
  useEffect(() => {
    console.log(selectedWhys);
  }, [selectedWhys]);

  const generatePotentialRootProb = async () => {
    if (selectedWhys.length === 0) {
      alert(
        "Cannot generate a potential root problem withP no why's selected."
      );
      return;
    }
    setIsLoading((prev) => !prev);
    try {
      let token = localStorage.getItem("token");
      let response = await axios.post(
        "https://babyjoy456.pythonanywhere.com/api/ai/potential_root/",
        {
          selected_statement: statement,
          list_of_whys: [...selectedWhys],
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log(response.data);
      sessionStorage.setItem("root_five_whys", JSON.stringify(selectedWhys));
      navigate("/hmw", {
        state: {
          potential_root: response.data,
          statement_id: statement_id,
          venn: venn,
          statement: statement,
          list_of_whys: [...selectedWhys],
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      sessionStorage.removeItem("selected_whys");
      sessionStorage.removeItem("selected_hmws");
      sessionStorage.removeItem("five_hmws");
      sessionStorage.removeItem("elevatorPitch");
      setIsLoading((prev) => !prev);
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoadingScreen />
        </Box>
      ) : (
        <Box
          sx={{
            px: 12,
            py: 2,
            width: "90%",
            margin: "auto",
            maxWidth: "1000px",
          }}
        >
          <Typography variant="h1" textAlign={"center"} fontSize="50px">
            5 Whys
          </Typography>
          <Typography
            variant="body1"
            textAlign={"center"}
            fontSize="14px"
            width="800px"
            margin="auto"
            marginBottom={"50px"}
            marginTop="10px"
          >
            Now subject the selected problem statement to a 5-Why analysis. In
            5-Whys, you ask "why" five times to uncover the underlying issue
            behind a problem. Click the generate button to generate a 5 whys
            statement
          </Typography>
          {/* Top Part */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Selected Problem Statement</Typography>
              <Box sx={{ mt: 3, ml: 7 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Below, is your selected ranked problem statement.
                </Typography>
                <Grid
                  container
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                      mt: 2,
                      width: "100%",
                    }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        border: "1px solid #8e8e8e",
                        borderRadius: 4,
                        boxShadow: "none",
                        margin: "auto",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2">{statement}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 5, color: "#FFFB" }}
                          onClick={handleShowPopup}
                        >
                          Show
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                </Grid>
                <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                  <Button
                    variant="contained"
                    disabled={statement === "" ? true : false}
                    onClick={() => generateFiveWhys(statement)}
                    sx={{
                      height: "50px",
                      borderRadius: 5.6,
                      color: "#FFFB",
                    }}
                  >
                    Generate Whys
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Part */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Generated 5 Why's</Typography>
              <Box sx={{ mt: 1, ml: 7 }}>
                <Box>
                  <Typography variant="body2" textAlign={"justify"}>
                    Enumerate 5 HMW statement(s) by specifying an ACTION (what
                    you want to achieve), a SUBJECT (to be influenced or
                    affected), and a WHAT (outcome or what you like to achieve).
                  </Typography>
                  <Box sx={{ my: 5 }}>
                    <Box>
                      {fiveWhys.map((value, index) => (
                        <Box sx={{ mt: 2 }}>
                          <WhysCard
                            key={index}
                            value={value}
                            addWhysToList={addWhysToList}
                            setFiveWhys={setFiveWhys}
                          />
                        </Box>
                      ))}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="contained"
                          disabled={
                            fiveWhys.length === 0 || selectedWhys.length === 0
                          }
                          onClick={generatePotentialRootProb}
                          sx={{
                            px: 2.3,
                            py: 1.2,
                            borderRadius: 5.6,
                            color: "#FFFB",
                            height: "50px",
                          }}
                        >
                          Generate Root
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {isPopupOpen && (
            <PopupVennHistory
              venn={venn}
              open={isPopupOpen}
              onClose={handleClosePopup}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default FiveWhys;
