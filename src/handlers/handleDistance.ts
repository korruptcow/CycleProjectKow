import globalStore from "@store/globalStore";

const handleDistance = () => {
  // Get distance between pairs of lat/lon
  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    if (d > 1) d = 0;
    return d;
  };

  // Return radians from degrees
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  globalStore.trackingPaused.onChange((trackingPaused) => {
    if (!trackingPaused.value) {
      globalStore.isFirstTrackingRecord.set(true);
    }
  });

  // Check for a sessionId, reset totalDistance if it changes as this indicates stream start.
  globalStore.sessionId.onChange((sessionId) => {
    if (sessionId.value && sessionId.value !== sessionId.getPrevious()) {
      globalStore.sessionDistance.set(0)
      globalStore.isFirstTrackingRecord.set(true);
    }
  })

  // Observe location changes and calculate distance
  globalStore.location.onChange((location) => {
    // Ignore location and return if the previous lat/lon was 0 - this indicates cold start - GPS often jumps from 0 to new location.
    if (!location.getPrevious().latitude && !location.getPrevious().longitude) return;
    if (globalStore.lastLocationUpdate.get() !== 0 && Date.now() - globalStore.lastLocationUpdate.get() > 60_000) {
      globalStore.lastLocationUpdate.set(Date.now());
      return;
    }
    // Otherwise, calculate distance between previous and current location and add to total distance
    if (!globalStore.trackingPaused.get()) {
      if (!globalStore.isFirstTrackingRecord.get()) {
        globalStore.totalDistance.set(globalStore.totalDistance.get() + getDistanceFromLatLonInKm(
            location.getPrevious().latitude,
            location.getPrevious().longitude,
            location.value.latitude,
            location.value.longitude
        ));
        globalStore.sessionDistance.set(globalStore.sessionDistance.get() + getDistanceFromLatLonInKm(
            location.getPrevious().latitude,
            location.getPrevious().longitude,
            location.value.latitude,
            location.value.longitude
        ));
        globalStore.goalDistance.set(globalStore.goalDistance.get() - getDistanceFromLatLonInKm(
            location.getPrevious().latitude,
            location.getPrevious().longitude,
            location.value.latitude,
            location.value.longitude
        ));

        globalStore.lastLocationUpdate.set(Date.now());
      } else {
        globalStore.isFirstTrackingRecord.set(false);
        globalStore.lastLocationUpdate.set(Date.now());
      }
    }

  })
};

handleDistance();
