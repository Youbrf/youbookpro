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
    weekNumbers: true,
    dayMaxEvents: true,
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