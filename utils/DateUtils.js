export const formatDateCZ = (timestamp) => {

    if (timestamp && timestamp.seconds !== undefined) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('cs-CZ');
    } else {
        return null;
    }

};

export const formatDate = (timestamp) => {

    if (timestamp && timestamp.seconds !== undefined) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-US');
    } else {
        return null;
    }

};

export const getNextSevenDays = (currentDate) => {
    const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const nextSevenDays = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() + i);
        nextSevenDays.push({ day: days[date.getDay()], date: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() });
    }

    return nextSevenDays;
};

export const getLastTenDays = (currentDate) => {
    const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const lastTenDays = [];

    for (let i = 0; i < 10; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        lastTenDays.push({ day: days[date.getDay()], date: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() });
    }

    return lastTenDays;
};

export const getSelectedDayDate = (selectedDay) => {
    const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const thisDay = [];

    for (let i = 0; i < 1; i++) {
        const date = new Date(selectedDay);
        date.setDate(selectedDay.getDate() - i);
        thisDay.push({ day: days[date.getDay()], date: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() });
    }

    return thisDay;
}

export const startOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
}

export const endOfDay = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
}