'use client';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import toast from 'react-hot-toast';

interface EventFormProps {
  newEvent: {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
    location: string;
    participants: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowEventForm: (show: boolean) => void;
  error: string;
  isModify: boolean;
  events: any[];
  setEvents: (events: any[]) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  newEvent,
  handleInputChange,
  handleSubmit,
  setShowEventForm,
  error,
  isModify,
  events,
  setEvents,
}) => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const token = useAppSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await newRequest.get(`/api/v1/user?role=giangvien`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.data);
    };

    const fetchRoom = async () => {
      const res = await newRequest.get(`/api/v1/room`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(res.data.data);
    };

    fetchUser();
    fetchRoom();
  }, [token]);

  // Handle update event
  const handleUpdate = async () => {
    try {
      const res = await newRequest.put(
        `/api/v1/schedule/update/${newEvent.id}`,
        {
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          description: newEvent.description,
          location: parseInt(newEvent.location),
          participants: parseInt(newEvent.participants),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update the events array with the modified event
      if (Array.isArray(events)) {
        const updatedEvents = [...events];
        const eventIndex = updatedEvents.findIndex(
          (event) => event.id === newEvent.id,
        );
        if (eventIndex !== -1) {
          updatedEvents[eventIndex] = res.data.data;
          setEvents(updatedEvents);
        }
      }

      toast.success('Update successfully');
      setShowEventForm(false);
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error updating event:', error);
    }
  };

  // Handle delete event
  const handleDelete = async () => {
    try {
      if (newEvent.id) {
        await newRequest.delete(`/api/v1/schedule/delete/${newEvent.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Remove the deleted event from the events array
        if (Array.isArray(events)) {
          const updatedEvents = events.filter(
            (event) => event.id !== newEvent.id,
          );
          setEvents(updatedEvents);
        }

        toast.success('Delete successfully');
        setShowEventForm(false);
      } else {
        toast.error('Event ID is missing');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"
      >
        {isModify ? (
          <h2 className="text-2xl font-bold mb-4">Modify Event</h2>
        ) : (
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-bold">
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="start" className="block mb-2 font-bold">
            Start Date and Time*
          </label>
          <input
            type="datetime-local"
            id="start"
            name="start"
            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="end" className="block mb-2 font-bold">
            End Date and Time*
          </label>
          <input
            type="datetime-local"
            id="end"
            name="end"
            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-bold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block mb-2 font-bold">
            Location*
          </label>
          <select
            id="location"
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a room</option>
            {rooms.map((room: any) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="participants" className="block mb-2 font-bold">
            Assign to*
          </label>
          <select
            id="participants"
            name="participants"
            value={newEvent.participants}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a user</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowEventForm(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>

          {isModify && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          )}

          {isModify ? (
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Event
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventForm;
