import { IconButton } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import moment, { Moment } from "moment";
import { useLanguage } from "../../contexts/LanguageContext"; // Importar el contexto del idioma
import "moment/locale/es";
import "moment/locale/ca";

import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useRef, useState } from "react";

export interface CalendarEvent {
  date: Moment;
  label: string;
  description: string;
  id: string;
}

interface HeadingProps {
  date: Moment;
  changeMonth: (month: number) => void;
  resetDate: () => void;
}

const Heading: React.FC<HeadingProps> = ({ date, changeMonth, resetDate }) => (
  <div className="calendar--nav flex justify-between items-center rounded-full text-white">
    <IconButton onClick={() => changeMonth(date.month() - 1)} size="small">
      <ArrowBackIosOutlinedIcon fontSize="inherit" className="text-white" />
    </IconButton>
    <h1 onClick={resetDate} className="cursor-pointer text-lg">
      {date.format("MMMM").charAt(0).toUpperCase() +
        date.format("MMMM").slice(1)}{" "}
      <small>{date.format("YYYY")}</small>
    </h1>
    <IconButton onClick={() => changeMonth(date.month() + 1)} size="small">
      <ArrowBackIosOutlinedIcon
        fontSize="inherit"
        className="text-white rotate-180"
      />
    </IconButton>
  </div>
);

interface DayProps {
  currentDate: Moment;
  date: Moment;
  events: CalendarEvent[];
  selectedDate: Moment | null;
  onDateClick: (date: Moment) => void;
}

const Day: React.FC<DayProps> = ({
  currentDate,
  date,
  events,
  selectedDate,
  onDateClick,
}) => {
  const isToday = moment().isSame(date, "day");
  const isSelected = selectedDate?.isSame(date, "day");
  const event = events.find((e) => e.date.isSame(date, "day"));

  const className = [
    "my-1 rounded-3xl",
    isToday && isSelected
      ? "bg-white text-primary"
      : isToday
      ? "bg-white text-black"
      : isSelected
      ? "bg-primary"
      : "",
    event ? "border border-primary-blue" : "",
    !date.isSame(currentDate, "month") ? "text-gray-300 opacity-50" : "",
  ]

    .filter(Boolean)
    .join(" ");

  return (
    <span
      onClick={() => onDateClick(date)}
      className={`align-middle flex items-center justify-center cursor-pointer mx-2 text-center ${className}`}
    >
      {date.date()}
      {/* {event && <div className="text-xs">{event.label}</div>} */}
    </span>
  );
};

interface DaysProps {
  date: Moment;
  events: CalendarEvent[];
  selectedDate: Moment | null;
  onDateClick: (date: Moment) => void;
}

const Days: React.FC<DaysProps> = ({
  date,
  events,
  selectedDate,
  onDateClick,
}) => {
  const thisDate = moment(date);
  const firstDayDate = moment(date).startOf("month");
  const previousMonth = moment(date).subtract(1, "month");
  let days: Moment[] = [];
  let labels: JSX.Element[] = [];

  const formatDayName = (dayNumber: number): string => {
    const dayName = moment().weekday(dayNumber).format('ddd');
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }

  for (let i = 0; i < 7; i++) {
    labels.push(<span className="p-2">{formatDayName(i % 7)}</span>);
  }

  const prevDaysInMonth = previousMonth.daysInMonth();
  let firstDay = firstDayDate.weekday();
  for (let i = firstDay; i > 0; i--) {
    const day = moment(previousMonth).date(prevDaysInMonth - i + 1);
    days.push(day);
  }

  for (let i = 1; i <= date.daysInMonth(); i++) {
    thisDate.date(i);
    days.push(moment(thisDate));
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const day = moment(date).add(1, "month").date(i);
    days.push(day);
  }

  return (
    <div className="grid grid-cols-7">
      {labels}
      {days.map((dayDate) => (
        <Day
          key={dayDate.toString()}
          currentDate={date}
          date={dayDate}
          events={events}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
        />
      ))}
    </div>
  );
};

interface CalendarProps {
  events?: CalendarEvent[];
}

interface CalendarProps {
  events?: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events = [] }) => {
  const { language } = useLanguage(); // Obtén el idioma actual del contexto
  moment.locale(language);
  const [date, setDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const resetDate = () => setDate(moment());
  const changeMonth = (month: number) => {
    const newDate = moment(date).month(month);
    setDate(newDate);
  };

  const openSessionHistory = (id: string, name: string) => {};
  const openNewTab = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string,
    name: string
  ) => {
    event.stopPropagation();
  };

  const eventForSelectedDate = selectedDate
    ? events.find((e) => e.date.isSame(selectedDate, "day"))
    : null;

  return (
    <div className="flex flex-col gap-2" ref={divRef}>
      <div className="calendar rounded-3xl bg-transparent">
        <Heading date={date} changeMonth={changeMonth} resetDate={resetDate} />
        <Days
          date={date}
          events={events}
          selectedDate={selectedDate}
          onDateClick={setSelectedDate}
        />
      </div>
      {eventForSelectedDate && (
        <div
          className="flex justify-center min-h-fit items-center rounded-3xl bg-primary cursor-pointer"
          onClick={() =>
            openSessionHistory(
              eventForSelectedDate.id,
              eventForSelectedDate.label
            )
          }
        >
          <div className="ml-[50%] -translate-x-2/4 p-4 ">
            <h2 className="text-lg font-bold">{eventForSelectedDate.label}</h2>
            <p>{eventForSelectedDate.description}</p>
          </div>
          <OpenInNewIcon
            className="hover:bg-light-primar rounded ml-auto mr-8"
            onClick={(e) =>
              openNewTab(e, eventForSelectedDate.id, eventForSelectedDate.label)
            }
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
