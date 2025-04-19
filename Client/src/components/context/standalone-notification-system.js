(function setupNotificationSystem() {

  if (typeof window === 'undefined') return;

  if (window.__notificationSystemInitialized) return;
  window.__notificationSystemInitialized = true;

  let pollingInterval = null;

  const AUTH_STATUS_KEY = 'notification_system_auth_status';

  async function fetchNotifications() {
    try {
      if (localStorage.getItem(AUTH_STATUS_KEY) === 'unauthorized') {
        console.log("Skipping notification fetch due to recent 401");
        return;
      }

      const response = await fetch('http://localhost:8080/api/messages/unread', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const totalCount = Object.values(data).reduce((sum, count) => sum + count, 0);
        localStorage.setItem('eventify_unread_count', totalCount.toString());
        localStorage.setItem(AUTH_STATUS_KEY, 'authorized');
      } else if (response.status === 401) {
        console.log("Received 401 from notification API");
        localStorage.setItem(AUTH_STATUS_KEY, 'unauthorized');
      }
    } catch (e) {
      console.error("Error fetching notifications (standalone system):", e);
    }
  }

  function startPolling() {
    if (pollingInterval) clearInterval(pollingInterval);

    fetchNotifications();

    pollingInterval = setInterval(fetchNotifications, 5000);
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  function checkAuthAndTogglePolling() {
    const isAuthenticated = document.cookie.includes('JSESSIONID=') ||
      localStorage.getItem('rememberMe') === 'true' ||
      sessionStorage.getItem('plsStahp') === 'true';

    if (isAuthenticated) {
      localStorage.setItem(AUTH_STATUS_KEY, 'authorized');
      startPolling();
    } else {
      localStorage.setItem(AUTH_STATUS_KEY, 'unauthorized');
      stopPolling();
    }
  }

  window.addEventListener('login_success', function() {
    localStorage.setItem(AUTH_STATUS_KEY, 'authorized');
    checkAuthAndTogglePolling();
  });

  window.addEventListener('logout', function() {
    localStorage.setItem(AUTH_STATUS_KEY, 'unauthorized');
    checkAuthAndTogglePolling();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'rememberMe' || event.key === 'plsStahp') {
      checkAuthAndTogglePolling();
    }
    if (event.key === AUTH_STATUS_KEY) {
      checkAuthAndTogglePolling();
    }
  });

  checkAuthAndTogglePolling();

  window.addEventListener('beforeunload', stopPolling);
})();