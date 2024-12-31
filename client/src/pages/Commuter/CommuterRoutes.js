import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ViewBuses from './ViewBuses';
import BookTickets from './BookTickets';
import ViewBookings from './ViewBookings';
import FeedbackForm from './FeedbackForm';

const CommuterRoutes = () => {
  return (
    <Routes>
      <Route path="view-buses" element={<ViewBuses />} />
      <Route path="book-tickets" element={<BookTickets />} />
      <Route path="view-bookings" element={<ViewBookings />} />
      <Route path="feedback" element={<FeedbackForm />} />
    </Routes>
  );
};

export default CommuterRoutes;
