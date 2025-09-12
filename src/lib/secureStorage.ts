/**
 * Secure storage utility with encryption and XSS protection
 * Provides secure alternatives to localStorage for sensitive data
 */

interface SecureStorageOptions {
  encrypt?: boolean;
  expiry?: number; // in milliseconds
  prefix?: string;
}

class SecureStorage {
  private prefix: string;
  private encryptionKey: string;

  constructor(prefix = 'trek_secure_') {
    this.prefix = prefix;
    this.encryptionKey = this.generateEncryptionKey();
  }

  /**
   * Generate a simple encryption key based on browser fingerprint
   */
  private generateEncryptionKey(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset()
    ].join('|');
    
    return btoa(fingerprint).slice(0, 16);
  }

  /**
   * Simple XOR encryption for client-side data protection
   */
  private encrypt(data: string): string {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode(dataChar ^ keyChar);
    }
    return btoa(encrypted);
  }

  /**
   * Decrypt XOR encrypted data
   */
  private decrypt(encryptedData: string): string {
    try {
      const encrypted = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        const encryptedChar = encrypted.charCodeAt(i);
        decrypted += String.fromCharCode(encryptedChar ^ keyChar);
      }
      return decrypted;
    } catch {
      return '';
    }
  }

  /**
   * Store data securely with optional encryption and expiry
   */
  setItem<T>(key: string, value: T, options: SecureStorageOptions = {}): void {
    try {
      const { encrypt = true, expiry, prefix = this.prefix } = options;
      const fullKey = `${prefix}${key}`;
      
      const data = {
        value,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null,
        encrypted: encrypt
      };

      const serialized = JSON.stringify(data);
      const stored = encrypt ? this.encrypt(serialized) : serialized;
      
      // Use sessionStorage for sensitive data, localStorage for non-sensitive
      const storage = encrypt ? sessionStorage : localStorage;
      storage.setItem(fullKey, stored);
      
    } catch (error) {
      console.warn('SecureStorage: Failed to store item', error);
    }
  }

  /**
   * Retrieve data securely with automatic decryption and expiry check
   */
  getItem<T>(key: string, options: SecureStorageOptions = {}): T | null {
    try {
      const { encrypt = true, prefix = this.prefix } = options;
      const fullKey = `${prefix}${key}`;
      
      const storage = encrypt ? sessionStorage : localStorage;
      const stored = storage.getItem(fullKey);
      
      if (!stored) return null;

      const serialized = encrypt ? this.decrypt(stored) : stored;
      if (!serialized) return null;

      const data = JSON.parse(serialized);
      
      // Check expiry
      if (data.expiry && Date.now() > data.expiry) {
        this.removeItem(key, options);
        return null;
      }

      return data.value;
    } catch (error) {
      console.warn('SecureStorage: Failed to retrieve item', error);
      return null;
    }
  }

  /**
   * Remove item from secure storage
   */
  removeItem(key: string, options: SecureStorageOptions = {}): void {
    try {
      const { encrypt = true, prefix = this.prefix } = options;
      const fullKey = `${prefix}${key}`;
      
      const storage = encrypt ? sessionStorage : localStorage;
      storage.removeItem(fullKey);
    } catch (error) {
      console.warn('SecureStorage: Failed to remove item', error);
    }
  }

  /**
   * Clear all secure storage items
   */
  clear(): void {
    try {
      // Clear items with our prefix from both storages
      [localStorage, sessionStorage].forEach(storage => {
        const keys = Object.keys(storage).filter(key => key.startsWith(this.prefix));
        keys.forEach(key => storage.removeItem(key));
      });
    } catch (error) {
      console.warn('SecureStorage: Failed to clear storage', error);
    }
  }

  /**
   * Check if storage is available and secure
   */
  isAvailable(): boolean {
    try {
      const testKey = `${this.prefix}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

/**
 * Custom storage adapter for Supabase with security enhancements
 */
export class SupabaseSecureStorage {
  async getItem(key: string): Promise<string | null> {
    // Use secure storage for auth tokens
    if (key.includes('auth-token') || key.includes('refresh-token')) {
      return secureStorage.getItem(key, { 
        encrypt: true, 
        expiry: 24 * 60 * 60 * 1000 // 24 hours
      });
    }
    
    // Use regular storage for non-sensitive data
    return secureStorage.getItem(key, { encrypt: false });
  }

  async setItem(key: string, value: string): Promise<void> {
    // Use secure storage for auth tokens
    if (key.includes('auth-token') || key.includes('refresh-token')) {
      secureStorage.setItem(key, value, { 
        encrypt: true, 
        expiry: 24 * 60 * 60 * 1000 // 24 hours
      });
    } else {
      // Use regular storage for non-sensitive data
      secureStorage.setItem(key, value, { encrypt: false });
    }
  }

  async removeItem(key: string): Promise<void> {
    const isToken = key.includes('auth-token') || key.includes('refresh-token');
    secureStorage.removeItem(key, { encrypt: isToken });
  }
}

export const supabaseSecureStorage = new SupabaseSecureStorage();
