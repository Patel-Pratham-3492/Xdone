import { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import MonthlyQuote from "./MonthlyQuote";
import API from "../services/api"; 
import "./day.css";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Day() {
  const today = new Date();
  const todayLocal = new Date();
  const todayKey = `${todayLocal.getFullYear()}-${String(todayLocal.getMonth() + 1).padStart(2,"0")}-${String(todayLocal.getDate()).padStart(2,"0")}`;

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthSummary, setMonthSummary] = useState({ completedDays: 0, totalDays: 0 });
  const [yearSummary, setYearSummary] = useState({ completedDays: 0, totalDays: 0 });

  useEffect(() => {
    fetchMonthSummary();
    fetchYearSummary();
  }, [currentMonth, currentYear]);

  const fetchMonthSummary = async () => {
    try {
      const res = await API.get(`/summary/month-summary?year=${currentYear}&month=${currentMonth + 1}`);
      const daysMap = {};
      let completedDays = 0;

      res.data.forEach(day => {
        const dateKey = day.date.slice(0, 10); // YYYY-MM-DD
        let status = "none";
        if (day.totalTasks > 0 && day.completedTasks === day.totalTasks) {
          status = "completed";
          completedDays++;
        } else if (day.totalTasks > 0 && day.completedTasks < day.totalTasks) {
          status = "partial";
        }
        daysMap[dateKey] = { ...day, status };
      });

      generateCalendar(daysMap);
      const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      setMonthSummary({ completedDays, totalDays: totalDaysInMonth });
    } catch (err) {
      console.error("Month summary error:", err);
      setMonthSummary({ completedDays: 0, totalDays: new Date(currentYear, currentMonth + 1, 0).getDate() });
      generateCalendar({});
    }
  };

  const fetchYearSummary = async () => {
    try {
      const res = await API.get(`/summary/year-summary?year=${currentYear}`);
      const data = Array.isArray(res.data) ? res.data : [];
      const completedDaysCount = data.filter(d => d.totalTasks > 0 && d.completedTasks === d.totalTasks).length;

      const totalDaysInYear =
        (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0
          ? 366
          : 365;

      setYearSummary({ completedDays: completedDaysCount, totalDays: totalDaysInYear });
    } catch (err) {
      console.error("Year summary error:", err);
      setYearSummary({ completedDays: 0, totalDays: 365 });
    }
  };

  const generateCalendar = (daysMap) => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);

    for (let date = 1; date <= lastDate; date++) {
      const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(date).padStart(2,"0")}`;
      const dayInfo = daysMap[fullDate] || { status: "none" };
      days.push({ date, fullDate, status: dayInfo.status });
    }

    setCalendarDays(days);
  };

  const prevMonth = () => {
    if (currentMonth === 0) { 
      setCurrentMonth(11); 
      setCurrentYear(y => y - 1); 
    } else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { 
      setCurrentMonth(0); 
      setCurrentYear(y => y + 1); 
    } else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="day-section">
      <div className="day-grid">

        {/* Calendar */}
        <div className="day-left">
          <div className="day-card">
            <div className="day-header">
              <button className="nav-btn" onClick={prevMonth}>◀</button>
              <h2 className="day-title">{monthNames[currentMonth]} {currentYear}</h2>
              <button className="nav-btn" onClick={nextMonth}>▶</button>
            </div>

            <div className="week-row">
              {dayNames.map(d => <div key={d} className="week-day">{d}</div>)}
            </div>

            <div className="days-grid">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={idx} className="empty-day" />;

                const isToday = day.fullDate === todayKey;


                let dayClass = "day-item";
                if (day.status === "completed") dayClass += " completed";
                else if (day.status === "partial") dayClass += " partial";
                else dayClass += " none";
                if (isToday) dayClass += " today";

                // ✅ Streak only for fully completed days
                const prevDay = calendarDays[idx - 1];
                const nextDay = calendarDays[idx + 1];
                const streakLeft = prevDay && prevDay.status === "completed" && day.status === "completed";
                const streakRight = nextDay && nextDay.status === "completed" && day.status === "completed";

                return (
                  <div
                    key={day.fullDate}
                    className={`day-wrapper ${streakLeft ? "streak-left" : ""} ${streakRight ? "streak-right" : ""}`}
                  >
                    <div className={dayClass}>{day.date}</div>
                  </div>
                );
              })}
            </div>
          </div>
           <div className="day-quote">
                <MonthlyQuote month={currentMonth} />
            </div>
        </div>

        {/* Donut charts */}
        <div className="day-right">
          <div className="donut-card">
            <DonutChart
              completed={monthSummary.completedDays}
              total={monthSummary.totalDays || 1}
              color="#22c55e"
            />
            <p className="donut-label">Month Progress ({monthSummary.completedDays}/{monthSummary.totalDays})</p>
          </div>

          <div className="donut-card" style={{ marginTop: "20px" }}>
            <DonutChart
              completed={yearSummary.completedDays}
              total={yearSummary.totalDays || 1}
              color="#22c55e"
            />
            <p className="donut-label">Year Progress ({yearSummary.completedDays}/{yearSummary.totalDays})</p>
          </div>
        </div>

      </div>
    </div>
  );
}
