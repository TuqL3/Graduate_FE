'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css.css';
import { SearchBar } from '../components/searchBar';
import EventForm from '../components/eventForm';
import { newRequest } from '@/lib/newRequest';
import { headers } from 'next/headers';
import { useAppSelector } from '@/lib/redux/hooks';

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
  const token = useAppSelector((state: any) => state.auth.token);


  const transformToEvents = (apiData: any) => {
    return apiData.data.map((schedule: any) => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      location: schedule.room.id,
      participants: schedule.user.id,
      start: new Date(schedule.start_time),
      end: new Date(schedule.end_time),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await newRequest.get('/api/v1/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const events = transformToEvents(res.data);

        setEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      setError('Please fill in all required fields.');
      return;
    }
    if (newEvent.start >= newEvent.end) {
      setError('End time must be after start time.');
      return;
    }

    const newEventObject = { ...newEvent, id: events.length + 1 };

    setEvents((prevEvents) => [...prevEvents, newEventObject]);

    const res = await newRequest.post(
      '/api/v1/schedule/create',
      {
        location: parseInt(newEventObject.location),
        participants: parseInt(newEventObject.participants),
        description: newEventObject.description,
        start: newEventObject.start,
        end: newEventObject.end,
        title: newEventObject.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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
    event.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
