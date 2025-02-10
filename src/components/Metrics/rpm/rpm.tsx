import flagStore from "@store/flagStore"
import globalStore from "@store/globalStore"

const Rpm = () => {
  const { showRpm } = flagStore.get();
  const { rpm } = globalStore.get();
  return (
    <div className="rpm-text" style={{ display: showRpm ? '' : 'none' }}>{rpm !== 0 ? `Cadence : ${rpm} rpm` : ''}</div>
  )
}

export default Rpm
