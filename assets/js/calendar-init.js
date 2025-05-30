document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'UTC',
    themeSystem: 'bootstrap5',
    initialView: 'timeGridWeek',
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
    editable: true,
    eventStartEditable: true,
    eventDurationEditable: false,
    eventDrop: function(info) {
      const event = info.event;

      const data = new FormData();
      data.append('action', 'youbookpro_update_reservation');
      data.append('id', event.id);
      data.append('start', event.start.toISOString());

      fetch(ajaxurl, {
        method: 'POST',
        body: data,
        credentials: 'same-origin',
      })
      .then(response => response.json())
      .then(result => {
        if (!result.success) {
          alert('Erreur: ' + result.data);
          info.revert();
        } else {
          console.log('Mise à jour OK');
        }
      })
      .catch(() => {
        alert('Échec de la requête');
        info.revert();
      });
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
    },
    eventClick: function(info) {
      const event = info.event;
      const currentStart = event.start.toISOString().slice(0, 16); 

      const newStart = prompt('Nouvelle date et heure (format : AAAA-MM-JJTHH:MM)', currentStart);
      if (!newStart) return;

      const data = new FormData();
      data.append('action', 'youbookpro_update_reservation');
      data.append('id', event.id);
      data.append('start', newStart);

      fetch(ajaxurl, {
        method: 'POST',
        body: data,
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(result => {
        if (!result.success) {
          alert('Erreur : ' + result.data);
        } else {
          event.setStart(newStart);
          event.setEnd(result.data.end);
          alert('Réservation mise à jour.');
        }
      })
      .catch(() => {
        alert('Erreur réseau');
      });
    },
    eventBackgroundColor: 'rgba(193, 209, 255, 0.62)',  
    eventBorderColor: 'rgba(0, 0, 0, 0.25)',    
    eventTextColor: 'rgb(0, 0, 0)',           
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: false
    }

  });

  calendar.render();
});