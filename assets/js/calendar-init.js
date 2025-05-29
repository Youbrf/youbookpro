document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'UTC',
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    businessHours: {
      daysOfWeek: [ 1, 2, 3, 4, 5, 6],

      startTime: '10:00', 
      endTime: '18:00', 
    },
    weekNumbers: true,
    dayMaxEvents: true,
    selectable: true,
    navLinks: true,
      navLinkWeekClick: function(weekStart, jsEvent) {
        console.log('week start', weekStart.toISOString());
        console.log('coords', jsEvent.pageX, jsEvent.pageY);
      },
    events: {
      url: ajaxurl,
      method: 'GET',
      extraParams: {
        action: 'youbookpro_get_reservations'
      },
      failure: function () {
        alert('Échec du chargement des réservations');
      }
    }

  });

  calendar.render();
});