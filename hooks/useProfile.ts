import { useState, useCallback } from 'react';
import { getDatabase } from '../database/db';
import { BusinessDetails } from '../types/types';

const emptyProfile: BusinessDetails = {
  name: '', address: '', phone: '', email: '', gstin: '',
};

export function useProfile() {
  const [profile, setProfile] = useState<BusinessDetails>(emptyProfile);
  const [loaded, setLoaded] = useState(false);

  const loadProfile = useCallback(() => {
    try {
      const db = getDatabase();
      const row = db.getFirstSync<BusinessDetails>(
        `SELECT name, address, phone, email, gstin FROM profile WHERE id = 1`
      );
      if (row) {
        setProfile(row);
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  const saveProfile = useCallback((data: BusinessDetails) => {
    try {
      const db = getDatabase();
      db.runSync(
        `INSERT INTO profile (id, name, address, phone, email, gstin)
         VALUES (1, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name,
           address=excluded.address,
           phone=excluded.phone,
           email=excluded.email,
           gstin=excluded.gstin`,
        [data.name, data.address, data.phone, data.email, data.gstin]
      );
      setProfile(data);
      return true;
    } catch (e) {
      console.error('Error saving profile:', e);
      return false;
    }
  }, []);

  const isProfileComplete = profile.name.trim().length > 0;

  return { profile, loaded, loadProfile, saveProfile, isProfileComplete };
}
