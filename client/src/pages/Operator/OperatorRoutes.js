import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageBuses from './ManageBuses';
import AssignRoutes from './AssignRoutes';
import ViewSchedules from './ViewSchedules';
import ManageDrivers from './ManageDrivers';

const OperatorRoutes = () => {
  return (
    <Routes>
      <Route path="manage-buses" element={<ManageBuses />} />
      <Route path="assign-routes" element={<AssignRoutes />} />
      <Route path="view-schedules" element={<ViewSchedules />} />
      <Route path="manage-drivers" element={<ManageDrivers />} />
    </Routes>
  );
};

export default OperatorRoutes;
