// A singleton class so that the notification number could be seen on the avatar in the header, a workaround to not changing the entire structure

class NotificationStore {
  constructor() {
    this.unreadCount = this.loadFromStorage();
    this.subscribers = [];
  }

  saveToStorage(count) {
    try {
      localStorage.setItem('eventify_unread_count', count.toString());
    } catch (e) {
      console.error("Error saving notification count to localStorage:", e);
    }
  }

  loadFromStorage() {
    try {
      const storedCount = localStorage.getItem('eventify_unread_count');
      return storedCount ? parseInt(storedCount, 10) : 0;
    } catch (e) {
      console.error("Error loading notification count from localStorage:", e);
      return 0;
    }
  }

  
  setUnreadCount(count) {
    if (this.unreadCount !== count) {
      this.unreadCount = count;
      this.saveToStorage(count);
      this.notifySubscribers();
    }
  }

  getUnreadCount() {
    return this.unreadCount;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.unreadCount);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.unreadCount));
  }
}

const notificationStore = new NotificationStore();

export default notificationStore;