import { date } from 'quasar';

export const planWidth = 52;

export const planHeight = 34;

/*
 * Array di giorni nel mese
 */
export function datesFromMonthDays(datetime) {
  const dates = [];
  const days = date.daysInMonth(datetime);

  datetime = date.startOfDate(datetime, 'month');
  for (let i = 0; i < days; i += 1) {
    dates.push(date.addToDate(datetime, { days: i }));
  }

  return dates;
}

/*
 * Giorni necessari e ore per giorno in base alle ore previste, persone e disponibilità
 */
export function getDaysHours(startDay, orePreviste, workers, disponibilita) {
  const res = [];
  let a = 0;
  let sumHour = 0;

  while (sumHour < orePreviste) {
    let hour = 0;
    const day = date.addToDate(startDay, { days: a });
    const dayYMD = date.formatDate(day, 'YYYY-MM-DD');

    if (workers.length > 0) {
      for (let i = 0; i < workers.length; i++) {
        const idAnag = workers[i].id_anag;
        hour += disponibilita[idAnag].ore[dayYMD];
      }
    } else {
      const weekday = date.formatDate(day, 'd');
      hour = 8;
      if (weekday == 0) hour = 0;
      if (weekday == 6) hour = 4;
    }

    // Ultimo giorno
    if (sumHour + hour > orePreviste) {
      hour = orePreviste - sumHour;
    }

    res.push({ day: dayYMD, hour });

    sumHour += hour;
    a += 1;
  }

  return res;
}

/*
 * Totale per giorno delle ore Pianificate
 */
export function calcTotDayPlanHour(day, hoursPlans, disponibilita) {
  let totUsed = 0;
  const dayYMD = date.formatDate(day, 'YYYY-MM-DD');

  hoursPlans.forEach((plan) => {
    plan.hours.forEach((hour) => {
      if (dayYMD === hour.day) {
        totUsed += hour.hour;
      }
    });
  });

  const totDisp = Object.keys(disponibilita).reduce(
    (tot, id) => tot + disponibilita[id].ore[dayYMD],
    0,
  );

  return { totUsed, totDisp };
}

export function calcCellHeight(num) {
  const height = num > 1 ? planHeight + 30 * (num - 1) : planHeight;

  return `${height}px`;
}
