import React from "react";
import {
  Paper,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import TrainingProgramTab from "./tab/training-program/TrainingProgramTab";
import TrainingRequestTab from "./tab/training-program/TrainingRequestTab";

const AdminTrainingProgram = () => {
  const theme = useTheme();
  
  // Tab state
  const [currentTab, setCurrentTab] = React.useState(0);

  // Tab handler
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      {/* Tabs Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : theme.palette.background.default,
          borderRadius: 1,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minWidth: 120,
            },
          }}
        >
          <Tab label="Chương trình đào tạo" />
          <Tab label="Yêu cầu đào tạo" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && <TrainingProgramTab />}
      {currentTab === 1 && <TrainingRequestTab />}
    </>
  );
};

export default AdminTrainingProgram;
