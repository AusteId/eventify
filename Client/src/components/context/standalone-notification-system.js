(function setupNotificationSystem() {

  if (typeof window === 'undefined') return;

  if (window.__notificationSystemInitialized) return;
  window.__notificationSystemInitialized = true;

  let pollingInterval = null;

  async function fetchNotifications() {
    try {
      const response = await fetch('http://localhost:8080/api/messages/unread', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const totalCount = Object.values(data).reduce((sum, count) => sum + count, 0);
        localStorage.setItem('eventify_unread_count', totalCount.toString());
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
      startPolling();
    } else {
      stopPolling();
    }
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'rememberMe' || event.key === 'plsStahp') {
      checkAuthAndTogglePolling();
    }
  });

  checkAuthAndTogglePolling();

  window.addEventListener('beforeunload', stopPolling);
})();