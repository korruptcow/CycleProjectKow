import globalStore from "@store/globalStore";

const handleDistance = () => {
  const getRpm = (
      prevRevs: number,
      revs:number
  ) => {
    const previousTime = globalStore.prevRpmUpdateTime.get()
    const currentTime = globalStore.updatedAt.get()
    const elapsedTime = (currentTime - previousTime) / 1000;
    const revolutionDifference = revs - prevRevs
    const rpm = (revolutionDifference * 60) / elapsedTime
    return rpm > 0 ? rpm : 0;
  };


  globalStore.revolutions.onChange((revolutions) => {
    if (!revolutions.getPrevious()) return
    globalStore.rpm.set(getRpm(revolutions.getPrevious(), revolutions.value));
    const updateTime = globalStore.updatedAt.get();
    globalStore.prevRpmUpdateTime.set(updateTime);
  })
};

handleDistance();
