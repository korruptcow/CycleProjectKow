import { useEffect } from 'react';
import { forPullKey } from '@rtirl/api';

import keyStore from '@store/keyStore';
import globalStore from "@store/globalStore.ts";

interface IListenerProps {
  altitude: { EGM96: number, WGS84: number };
  heading: number;
  location: { latitude: number, longitude: number };
  reportedAt: number;
  speed: number;
  heartRate: number;
  revolutions: number;
  updatedAt: number;
}

interface ISessionListenerProps {
  sessionId: string;
}

const useListener = () => {
  const { pullKey } = keyStore.get();
  useEffect(() => {
    const unsubscribeListener = forPullKey(pullKey).addListener((data: IListenerProps) => {
      console.log(data)
      globalStore.set((prevState) => ({
        ...prevState,
        altitude: data.altitude,
        heading: data.heading,
        location: data.location,
        heartRate: data.heartRate,
        revolutions: data.revolutions,
        speed: (data.speed * 3.6),
        updatedAt: data.updatedAt,
      }));
    });
    const unsubscribeSessionListener = forPullKey(pullKey).addListener((data: ISessionListenerProps) => {
      globalStore.set((prevState) => ({
        ...prevState,
        sessionId: data.sessionId,
      }));
    });
    return () => {
      unsubscribeListener()
      unsubscribeSessionListener()
    };
  });
};

export default useListener;
