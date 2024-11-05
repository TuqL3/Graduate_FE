// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import '../css.css';
// import { SearchBar } from '../components/searchBar';
// import EventForm from '../components/eventForm';
// import { newRequest } from '@/lib/newRequest';
// import { headers } from 'next/headers';
// import { useAppSelector } from '@/lib/redux/hooks';

// moment.locale('en-GB');
// const localizer = momentLocalizer(moment);
// const DnDCalendar = withDragAndDrop(Calendar);
// interface Event {
//   title: string;
//   start: Date;
//   end: Date;
//   description: string;
//   location: string;
//   participants: string;
//   id?: string;
// }
// const CalendarSchedule = () => {
//   const [events, setEvents] = useState<any>([]);
//   console.log(events);

//   const [isModify, setIsModify] = useState<boolean>(false);
//   const [view, setView] = useState('month');
//   const [date, setDate] = useState(new Date());
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [newEvent, setNewEvent] = useState<Event>({
//     title: '',
//     start: new Date(),
//     end: new Date(),
//     description: '',
//     location: '',
//     participants: '',
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');
//   const token = useAppSelector((state: any) => state.auth.token);

//   const transformToEvents = (apiData: any) => {
//     return apiData.data.map((schedule: any) => ({
//       id: schedule.id,
//       title: schedule.title,
//       description: schedule.description,
//       location: schedule.room.id,
//       participants: schedule.user.id,
//       start: new Date(schedule.start_time),
//       end: new Date(schedule.end_time),
//     }));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await newRequest.get('/api/v1/schedule', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const events = transformToEvents(res.data);

//         setEvents(events);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSelectSlot = (slotInfo: any) => {
//     setNewEvent({
//       title: '',
//       start: slotInfo.start,
//       end: slotInfo.end,
//       description: '',
//       location: '',
//       participants: '',
//     });
//     setShowEventForm(true);
//     setIsModify(false);
//   };

//   const handleSelectEvent = (event: any) => {
//     setNewEvent({
//       title: event.title,
//       description: event.description,
//       start: event.start,
//       end: event.end,
//       location: event.location,
//       participants: event.participants,
//       id: event.id,
//     });
//     setShowEventForm(true);
//     setIsModify(true);
//   };

//   const handleEventDrop = ({ event, start, end }) => {
//     const updatedEvents = events.map((ev) =>
//       ev.id === event.id ? { ...ev, start, end } : ev,
//     );
//     setEvents(updatedEvents);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent({ ...newEvent, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!newEvent.title || !newEvent.start || !newEvent.end) {
//       setError('Please fill in all required fields.');
//       return;
//     }
//     if (newEvent.start >= newEvent.end) {
//       setError('End time must be after start time.');
//       return;
//     }

//     const newEventObject = { ...newEvent, id: events.length + 1 };

//     setEvents((prevEvents) => [...prevEvents, newEventObject]);

//     const res = await newRequest.post(
//       '/api/v1/schedule/create',
//       {
//         location: parseInt(newEventObject.location),
//         participants: parseInt(newEventObject.participants),
//         description: newEventObject.description,
//         start: newEventObject.start,
//         end: newEventObject.end,
//         title: newEventObject.title,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     setShowEventForm(false);

//     setNewEvent({
//       title: '',
//       start: new Date(),
//       end: new Date(),
//       description: '',
//       location: '',
//       participants: '',
//     });

//     setError('');
//   };

//   const filteredEvents = events.filter((event) =>
//     event.description.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   console.log(filteredEvents);

//   return (
//     <div>
//       <div className="mb-6 flex justify-between items-center space-x-4">
//         <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//       </div>

//       <DnDCalendar
//         localizer={localizer}
//         events={filteredEvents}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 600 }}
//         onSelectSlot={handleSelectSlot}
//         onSelectEvent={handleSelectEvent}
//         onEventDrop={handleEventDrop}
//         selectable
//         resizable
//         views={['day', 'week', 'month', 'agenda']}
//         view={view}
//         onView={setView}
//         date={date}
//         onNavigate={setDate}
//         className="shadow-lg rounded-lg bg-white"
//         tooltipAccessor={(event) => `${event.title}\n${event.description}`}
//       />
//       {showEventForm && (
//         <EventForm
//           isModify={isModify}
//           newEvent={newEvent}
//           handleInputChange={handleInputChange}
//           handleSubmit={handleSubmit}
//           setShowEventForm={setShowEventForm}
//           error={error}
//         />
//       )}
//     </div>
//   );
// };

// export default CalendarSchedule;

"use client"
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
import { useAppSelector } from '@/lib/redux/hooks';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarSchedule = () => {
  const [events, setEvents] = useState<any>([]);
  const [isModify, setIsModify] = useState<boolean>(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    location: '',
    participants: '',
    id: undefined,
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
  }, [token]);

  const handleSelectSlot = (slotInfo: any) => {
    setNewEvent({
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      description: '',
      location: '',
      participants: '',
      id: undefined,
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

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const res = await newRequest.put(
        `/api/v1/schedule/update/${event.id}`,
        {
          start: start,
          end: end,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedEvents = events.map((ev) =>
        ev.id === event.id ? { ...ev, start, end } : ev,
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating event:', error);
    }
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

    try {
      const res = await newRequest.post(
        '/api/v1/schedule/create',
        {
          location: parseInt(newEvent.location),
          participants: parseInt(newEvent.participants),
          description: newEvent.description,
          start: newEvent.start,
          end: newEvent.end,
          title: newEvent.title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newEventData = {
        id: res.data.data.id,
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        participants: newEvent.participants,
        start: newEvent.start,
        end: newEvent.end,
      };

      setEvents((prevEvents) => [...prevEvents, newEventData]);
      setShowEventForm(false);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        location: '',
        participants: '',
        id: undefined,
      });
      setError('');
    } catch (error) {
      console.error('Error creating event:', error);
    }
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
          events={events}
          setEvents={setEvents}
        />
      )}
    </div>
  );
};

export default CalendarSchedule;