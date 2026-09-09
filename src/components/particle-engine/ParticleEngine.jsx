import "./ParticleEngine.css";

function ParticleEngine({
  active = false,
}) {
  if (!active) return null;

  return (
    <div className="particle-engine">

      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="particle"
          style={{
            "--i": index,
          }}
        />
      ))}

    </div>
  );
}

export default ParticleEngine;