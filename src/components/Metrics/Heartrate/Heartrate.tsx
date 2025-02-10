import flagStore from "@store/flagStore"
import globalStore from "@store/globalStore"

const Heartrate = () => {
  const { showHeartrate } = flagStore.get();
  const heartrate = globalStore.heartrate.get();
  return (
    <div className="heart-text" style={{ display: showHeartrate ? '' : 'none' }}>
      Heartrate: {heartrate} bpm
    </div>
  )
}

export default Heartrate
