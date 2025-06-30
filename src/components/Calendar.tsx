import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, X, Trash2, Edit, Coins, Calendar as CalendarIcon } from 'lucide-react';
import './../index.css';

type EventType = 'solo' | 'team' | 'special';

interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
  type: EventType;
  coins: number;
  className?: string;
}

const EVENT_TYPES: { value: EventType; label: string; color: string; className: string }[] = [
  { value: 'solo', label: 'Solo Event', color: '#3B82F6', className: 'event-solo' },
  { value: 'team', label: 'Team Event', color: '#10B981', className: 'event-team' },
  { value: 'special', label: 'Special Event', color: '#EF4444', className: 'event-special' },
];

const Calendar: React.FC = () => {
  const isAdmin = true; // This should come from your auth context/state
  const [currentView, setCurrentView] = useState<string>('dayGridMonth');

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T11:30:00',
      type: 'team',
      coins: 100,
      className: 'event-team'
    },
    {
      id: '2',
      title: 'Project Deadline',
      start: '2024-03-22',
      allDay: true,
      type: 'special',
      coins: 200,
      className: 'event-special'
    },
    {
      id: '3',
      title: 'Training Session',
      start: '2024-03-21T14:00:00',
      end: '2024-03-21T16:00:00',
      type: 'solo',
      coins: 50,
      className: 'event-solo'
    }
  ]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    allDay: false,
    type: 'solo' as EventType,
    coins: 0
  });

  const handleDateSelect = (selectInfo: any) => {
    if (!isAdmin) return;
    
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      type: 'solo',
      coins: 0
    });
    setShowEventModal(true);
  };

  const handleEventClick = (clickInfo: any) => {
    if (!isAdmin) return;
    
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setNewEvent({
        title: event.title,
        start: event.start,
        end: event.end || '',
        allDay: event.allDay || false,
        type: event.type,
        coins: event.coins
      });
      setShowEventModal(true);
    }
  };

  const handleEventAdd = () => {
    if (!newEvent.title.trim()) return;

    const eventType = EVENT_TYPES.find(type => type.value === newEvent.type);

    if (selectedEvent) {
      setEvents(events.map(event => 
        event.id === selectedEvent.id
          ? {
              ...event,
              title: newEvent.title,
              start: newEvent.start,
              end: newEvent.end,
              allDay: newEvent.allDay,
              type: newEvent.type,
              className: eventType?.className,
              coins: newEvent.coins
            }
          : event
      ));
    } else {
      setEvents([...events, {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay,
        type: newEvent.type,
        className: eventType?.className,
        coins: newEvent.coins
      }]);
    }
    
    handleCloseModal();
  };

  const handleEventDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setNewEvent({ title: '', start: '', end: '', allDay: false, type: 'solo', coins: 0 });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Calendar
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isAdmin ? 'ปฏิทินกิจกรรม' : 'View schedule and events'}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowEventModal(true)}
              className="fixed bottom-6 right-6 z-10 md:static md:z-0 px-4 py-2 bg-blue-600 text-white rounded-full md:rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl md:shadow-sm md:hover:shadow-md"
            >
              <Plus size={16} />
              Add Event
            </button>
          )}
        </div>

        
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={isAdmin}
          selectable={isAdmin}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          className="fc-theme-custom"
          viewDidMount={(view) => setCurrentView(view.view.type)}
          eventContent={(eventInfo) => {
            const event = events.find(e => e.id === eventInfo.event.id);
            return (
              <div className="flex flex-col gap-1 p-1">
                <div className="font-medium line-clamp-2">{eventInfo.event.title}</div>
                {event && (
                  <div className="flex items-center text-xs gap-1 opacity-90">
                    <Coins size={12} />
                    {event.coins}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md event-modal">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coins Reward
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Coins size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.coins}
                    onChange={(e) => setNewEvent({ ...newEvent, coins: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    placeholder="Enter coins amount"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="allDay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  All day event
                </label>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-end gap-3">
                {selectedEvent && (
                  <button
                    onClick={handleEventDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEventAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  {selectedEvent ? <Edit size={16} /> : <Plus size={16} />}
                  {selectedEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;