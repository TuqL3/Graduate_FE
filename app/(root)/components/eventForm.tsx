// EventForm.tsx
import React from 'react';
import moment from 'moment';

interface EventFormProps {
  newEvent: {
    title: string;
    start: Date;
    end: Date;
    description: string;
    location: string;
    participants: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowEventForm: (show: boolean) => void;
  error: string;
  isModify: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  newEvent,
  handleInputChange,
  handleSubmit,
  setShowEventForm,
  error,
  isModify,
}) => {
  function handleUpdate(e: any): void {
    e.preventDefault();
    console.log(newEvent);
  }

  function handleDelete(e: any): void {
    e.preventDefault();
    console.log(newEvent);
  }

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
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="participants" className="block mb-2 font-bold">
            Participants
          </label>
          <input
            type="text"
            id="participants"
            name="participants"
            value={newEvent.participants}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              //   onClick={() => setShowEventForm(false)}
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          )}

          {isModify ? (
            <button
              //   type="submit
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
