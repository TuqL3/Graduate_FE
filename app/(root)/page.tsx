'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { SearchBar } from './components/searchBar';
import EventForm from './components/eventForm';
import './css.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
interface Event {
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  participants: string;
  id?: string;
}
const CalendarSchedule = () => {
  const [events, setEvents] = useState<any>([]);
  const [isModify, setIsModify] = useState<boolean>(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    location: '',
    participants: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulating fetching events from an API
    const fetchedEvents = [
      {
        id: 1,
        title: 'Meeting with team',
        start: moment().toDate(),
        end: moment().add(1, 'hours').toDate(),
        description: 'Discuss project progress',
        location: 'Conference Room A',
        participants: 'John, Jane, Bob',
      },
      {
        id: 2,
        title: 'Lunch break',
        start: moment().add(2, 'hours').toDate(),
        end: moment().add(3, 'hours').toDate(),
        description: 'Team lunch',
        location: 'Cafeteria',
        participants: 'All team members',
      },
    ];
    setEvents(fetchedEvents);
  }, []);

  const handleSelectSlot = (slotInfo: any) => {
    setNewEvent({
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      description: '',
      location: '',
      participants: '',
    });
    setShowEventForm(true);
    setIsModify(false);
  };

  const handleSelectEvent = (event: any) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      location: event.location,
      participants: event.participants,
      id: event.id,
    });
    setShowEventForm(true);
    setIsModify(true);
  };

  // const handleSelectSlot = (slotInfo: any) => {
  //   setNewEvent({
  //     ...newEvent,
  //     start: slotInfo.start,
  //     end: slotInfo.end,
  //   });
  //   setShowEventForm(true);
  // };

  // const handleSelectEvent = (event: any) => {

  //   setNewEvent({
  //     ...newEvent,
  //     title: event.title,
  //     description: event.description,
  //     start: event.start,
  //     end: event.end,
  //     location: event.location,
  //     participants: event.participants,
  //   });
  //   setShowEventForm(true);
  // };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvents = events.map((ev) =>
      ev.id === event.id ? { ...ev, start, end } : ev,
    );
    setEvents(updatedEvents);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      setError('Please fill in all required fields.');
      return;
    }
    if (newEvent.start >= newEvent.end) {
      setError('End time must be after start time.');
      return;
    }
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      description: '',
      location: '',
      participants: '',
    });
    setError('');
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center space-x-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <DnDCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        selectable
        resizable
        views={['day', 'week', 'month', 'agenda']}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        className="shadow-lg rounded-lg bg-white"
        tooltipAccessor={(event) => `${event.title}\n${event.description}`}
      />
      {showEventForm && (
        <EventForm
          isModify={isModify}
          newEvent={newEvent}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowEventForm={setShowEventForm}
          error={error}
        />
      )}
    </div>
  );
};

export default CalendarSchedule;
