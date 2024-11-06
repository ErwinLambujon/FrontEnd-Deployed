import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Venn3Paper from "../components/venndiagramreport/VennDiagramPaper3";
import Venn2Paper from "../components/venndiagramreport/VennDiagramPaper2";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ElevatorPitch from "./../components/popupcards/elevatorPitchPopUp/ElevatorPitch";
import { Card, CardContent, Grid } from "@mui/material";

const pitch = [
  "For",
  "Who",
  "We Provide",
  "That",
  "Unlike",
  "Who",
  "Our solution",
  "That",
];

const Report = () => {
  const location = useLocation();

  const [details, setDetails] = useState({
    venn: {
      field1: "",
      field2: "",
      field3: "",
      filter: "",
    },
    statement: "",
    potential_root: "",
    whys: [],
    hmws: [],
    elevator_pitch: [],
  });

  useEffect(() => {
    // console.log(location.state?.list_of_hmws);
    const venn = location.state?.venn ||
      sessionStorage.getItem("hmw_venn") || {
        field1: "",
        field2: "",
        field3: "",
        filter: "",
      };
    console.log(venn);
    const ps_id =
      location.state?.statement_id ||
      sessionStorage.getItem("report_statement_id");
    console.log(`ps_id: ${ps_id}`);
    const whys =
      location.state?.list_of_whys ||
      JSON.parse(sessionStorage.getItem("report_whys")) ||
      [];
    const hmws =
      location.state?.list_of_hmws ||
      JSON.parse(sessionStorage.getItem("report_hmws")) ||
      [];

    const potential_root =
      location.state?.potential_root ||
      sessionStorage.getItem("report_generated_root") ||
      "";

    console.log(hmws);

    const elevator_pitch =
      location.state?.elevatoor_pitch ||
      JSON.parse(sessionStorage.getItem("report_elevator_pitch")) ||
      [];

    // console.log(ps_id);
    const retrieveData = async () => {
      if (ps_id === null) {
        console.log(ps_id);
        alert("ASDAS");
        return;
      }
      let response;
      let token = localStorage.getItem("token");
      if (venn.field3 === "") {
        response = await axios.get(
          `https://babyjoy456.pythonanywhere.com/api/two_venn_ps/${ps_id}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
      } else {
        response = await axios.get(
          `https://babyjoy456.pythonanywhere.com/api/three_venn_ps/${ps_id}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
      }
      console.log(response.data.venn);
      setDetails((prev) => ({
        ...prev,
        whys: [...whys],
        hmws: [...hmws],
        venn: { ...response.data.venn },
        potential_root: potential_root,
        statement: response.data.statement,
      }));
    };
    console.log(typeof ps_id);
    if (ps_id !== "null") {
      retrieveData();
    }
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 4 }}
      >
        Report Page
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center", marginBottom: 4 }}>
        This page shows the entire process which to be saved as pdf by clicking
        CTRL + P and selecting save as pdf
      </Typography>

      {/* Venn part */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          width: "60%",
          margin: "auto",
          minWidth: "800px",
          maxWidth: "800px",
        }}
      >
        {/* Left Div */}
        <Box sx={{ flex: 1 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {details.venn && details.venn?.field3 !== "" ? (
              <Venn3Paper venn={details.venn} />
            ) : (
              <Venn2Paper venn={details.venn || { field1: "", field2: "" }} />
            )}
          </Box>
        </Box>

        {/* Right Div */}
        <Box sx={{ flex: 1, marginLeft: 4, alignContent: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Problem Statement
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 4 }}>
            {details.statement}
          </Typography>
        </Box>
      </Box>

      {/* Why Statements */}

      <Box
        sx={{
          marginTop: 10,
          marginBottom: 10,
          width: "70%",
          margin: "auto",
          minWidth: "700px",
          maxWidth: "900px",
        }}
      >
        <Typography
          variant="h5"
          color="#8E8E8E"
          fontSize="18px"
          sx={{ fontWeight: "bold", marginBottom: 0.5 }}
        >
          Why Statements
        </Typography>
        <Box>
          {Array.isArray(details.whys) &&
            details.whys.length > 0 &&
            details.whys.map((statement, index) => (
              <Paper
                key={index}
                elevation={4}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  borderRadius: 4,
                  minWidth: "600px",
                }}
              >
                <Typography variant="body1">{statement}</Typography>
              </Paper>
            ))}
        </Box>
      </Box>

      {/* HMW Statements */}
      <Box
        sx={{
          width: "70%",
          margin: "auto",
          minWidth: "700px",
          maxWidth: "900px",
        }}
      >
        <Box
          sx={{
            marginTop: 10,
            marginBottom: 10,
            margin: "auto",
            minWidth: "900px",
            maxWidth: "900px",
          }}
        >
          <Typography
            variant="h5"
            color="#8E8E8E"
            fontSize="18px"
            sx={{ fontWeight: "bold", marginBottom: 0.5 }}
          >
            Potential Root Problem
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              padding: 2,
              borderRadius: 4,
              borderColor: "#8e8e8e",
              marginBottom: 2,
            }}
          >
            <Typography variant="body1">{details.potential_root}</Typography>
          </Paper>
          <Typography
            variant="h5"
            color="#8E8E8E"
            fontSize="18px"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
            How might we statements
          </Typography>
        </Box>
        <Box>
          {Array.isArray(details.hmws) &&
            details.hmws.length > 0 &&
            details.hmws.map((statement, index) => (
              <Paper
                key={index}
                elevation={4}
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  borderRadius: 4,
                  minWidth: "600px",
                }}
              >
                <Typography variant="body1">{statement}</Typography>
              </Paper>
            ))}
        </Box>

        {/* <ElevatorPitch data={details.elevator_pitch} /> */}

        {/* Elevator pitch */}
        {/* <Grid container spacing={2}>
					{pitch.map((value, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<Card>
								<CardContent>
									<Grid container spacing={2} alignItems="center">
										<Grid item xs={3}>
											<Typography variant="h6">{value}</Typography>
										</Grid>
										<Grid item xs={9}>
											{details.elevator_pitch[index] && (
												<Typography variant="body1">
													{details.elevator_pitch[index]}
												</Typography>
											)}
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					))} */}
        {/* </Grid> */}
      </Box>
    </Box>
  );
};

export default Report;
