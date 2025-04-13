// A singleton class so that the notification number could be seen on the avatar in the header, a workaround to not changing the entire structure

class NotificationStore {
    constructor() {
      this.unreadCount = 0;
      this.subscribers = [];
      this.initialized = false;
      
      try {
        const storedCount = localStorage.getItem('eventify_unread_count');
        if (storedCount) {
          this.unreadCount = parseInt(storedCount, 10) || 0;
        }
      } catch (e) {
        console.error("Error loading notification count from localStorage:", e);
      }
    }
  
    saveToStorage(count) {
      try {
        localStorage.setItem('eventify_unread_count', count.toString());
      } catch (e) {
        console.error("Error saving notification count to localStorage:", e);
      }
    }
  
    setUnreadCount(count) {
      if (this.unreadCount !== count) {
        this.unreadCount = count;
        this.saveToStorage(count);
        this.notifySubscribers();
      }
      this.initialized = true;
    }
  
    getUnreadCount() {
      return this.unreadCount;
    }
  
    isInitialized() {
      return this.initialized;
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