import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Function to get the next preferred day
const getNextPreferredDay = (currentDate, preferredDays) => {
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    while (!preferredDays.includes(nextDate.getDay())) {
        nextDate.setDate(nextDate.getDate() + 1);
    }

    return nextDate;
};

const Booking = () => {
    const [formData, setFormData] = useState({
        sessionDate: null,
        sessionTime: '',
        totalSessions: 1,
        sessionDuration: 15,
        sessionInterval: 2,
        preferredDays: []
    });

    const [report, setReport] = useState([]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'totalSessions' || name === 'sessionInterval') {
            setFormData({
                ...formData,
                [name]: parseInt(value)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle date change for DatePicker
    const handleDateChange = (date) => {
        setFormData({ ...formData, sessionDate: date });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        generateSessionReport();
    };

    // Generate session report based on user input
    const generateSessionReport = () => {
        const { sessionDate, sessionTime, totalSessions, sessionInterval, preferredDays } = formData;
        const reportData = [];

        let currentSessionDate = new Date(sessionDate);

        for (let i = 0; i < totalSessions; i++) {
            reportData.push({
                date: currentSessionDate.toLocaleDateString(),
                time: sessionTime,
                duration: `${formData.sessionDuration} minutes`,
                day: currentSessionDate.toLocaleString('en-US', { weekday: 'long' })
            });

            currentSessionDate.setDate(currentSessionDate.getDate() + sessionInterval);

            if (preferredDays.length > 0 && !preferredDays.includes(currentSessionDate.getDay())) {
                currentSessionDate = getNextPreferredDay(currentSessionDate, preferredDays);
            }
        }

        setReport(reportData);
    };

    const isDisabled = !formData.sessionDate || !formData.sessionTime || !formData.totalSessions;
    const isIntervalDisabled = formData.totalSessions <= 1; // Disable session interval if total sessions is 1 or less
    const arePreferredDaysDisabled = formData.totalSessions <= 1; // Disable preferred days if total sessions is 1 or less

    return (
        <>
            <div className="session_booking">
                <form onSubmit={handleSubmit}>
                    <section className="row_1">
                        <div>
                            <label>Session Date:</label>
                            <br />
                            <DatePicker
                                selected={formData.sessionDate}
                                onChange={handleDateChange}
                                placeholderText="Session Date"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                required
                            />
                        </div>

                        <div>
                            <label>Session Time:</label><br />
                            <input
                                type="time"
                                name="sessionTime"
                                onChange={handleChange}
                                placeholder="Session Time"
                                required
                            />
                        </div>

                        <div>
                            <label>Total Sessions:</label><br />
                            <input
                                type="number"
                                name="totalSessions"
                                value={formData.totalSessions}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    </section>

                    <section className="row_2">
                        <div>
                            <label>Session Duration (minutes):</label><br />
                            <select
                                name="sessionDuration"
                                value={formData.sessionDuration}
                                onChange={handleChange}
                                required
                                disabled={isDisabled}
                            >
                                <option value={15}>15</option>
                                <option value={30}>30</option>
                                <option value={60}>60</option>
                            </select>
                        </div>

                        <div>
                            <label>Session Interval (days):</label><br />
                            <input
                                type="number"
                                name="sessionInterval"
                                value={formData.sessionInterval}
                                onChange={handleChange}
                                min="1"
                                required
                                disabled={isDisabled || isIntervalDisabled}
                            />
                        </div>

                        <div>
                            <label>Preferred Days:</label><br />
                            <div className='days'>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                    <div key={index}>
                                        <input
                                            type="checkbox"
                                            value={index}
                                            checked={formData.preferredDays.includes(index)}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                const selectedDays = formData.preferredDays.includes(parseInt(value))
                                                    ? formData.preferredDays.filter(day => day !== parseInt(value))
                                                    : [...formData.preferredDays, parseInt(value)];
                                                setFormData({ ...formData, preferredDays: selectedDays });
                                            }}
                                            disabled={arePreferredDaysDisabled}
                                        />
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <button type="submit" disabled={isDisabled}>Submit</button>
                </form>
            </div>

            <div>
                {report.length > 0 && (
                    <div>
                        <h2>Session Report</h2>
                        <ul>
                            {report.map((session, index) => (
                                <li key={index}>
                                    {session.date} at {session.time} for {session.duration} on {session.day}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default Booking;
