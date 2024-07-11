export const AnimatedArrow = (props) => {
  return (
    <div className={`animated-arrow d-flex ${props.className || ""}`}>
      <span className={`arrow ${props.direction || "right"}`}></span>
      <span className={`arrow ${props.direction || "right"}`}></span>
      <span className={`arrow ${props.direction || "right"}`}></span>
    </div>
  )
}
