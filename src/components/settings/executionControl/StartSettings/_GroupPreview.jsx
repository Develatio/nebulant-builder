import { hexToHSL, HSLtoString } from "@src/utils/colors";

export const GroupPreview = (props) => {
  const { name, color, text_color, image } = props;

  return (
    <div className="d-flex flex-column">
      <span className="mb-4">Preview</span>

      <div className="position-relative" style={{
        width: "100px",
        height: "120px",
        margin: "0 auto",
      }}>
        <div className="d-block position-absolute" style={{
          width: "100px",
          height: "120px",
          backgroundColor: HSLtoString(hexToHSL(color), 0.1),
          border: `1px solid ${HSLtoString(hexToHSL(color), 0.6)}`,
          transform: "rotate(10deg)",
          transformOrigin: "50px 60px",
          borderRadius: "5px",
        }}>

        </div>

        <div className="d-block position-absolute" style={{
          width: "100px",
          height: "120px",
          backgroundColor: HSLtoString(hexToHSL(color), 0.1),
          border: `1px solid ${HSLtoString(hexToHSL(color), 0.6)}`,
          transform: "rotate(20deg)",
          transformOrigin: "50px 60px",
          borderRadius: "5px",
        }}>

        </div>

        <div className="d-block position-absolute" style={{
          width: "100px",
          height: "120px",
          backgroundColor: HSLtoString(hexToHSL(color), 0.1),
          border: `1px solid ${HSLtoString(hexToHSL(color), 0.6)}`,
          backdropFilter: "blur(3px)",
          borderRadius: "5px",
        }}>
          <div className="d-flex flex-column position-relative w-100 h-100 align-items-center">
            <div className="position-absolute" style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "98px",
              height: "75px",
              top: "10px",
            }}></div>
            <span className="position-absolute" style={{
              top: "88px",
              width: "94px",
              fontSize: "12px",
              lineHeight: "14px",
              textAlign: "center",
              color: HSLtoString(hexToHSL(text_color), 1),
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
            }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
