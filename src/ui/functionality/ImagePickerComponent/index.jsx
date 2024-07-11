import Cropper from "react-cropper";
import Button from "react-bootstrap/esm/Button";
import { memo, useEffect, useRef, useState } from "react";

import { canvasPreview } from "./transform";

const ImagePickerComponent = memo(({
  config = {},
  help_text = "",
  imageSrcProp = "",
  imageChanged = () => {},
}) => {
  const [imgSrc, setImgSrc] = useState(imageSrcProp);
  const imageInput = useRef(null);
  const imgRef = useRef(null);
  const [cropping, setCropping] = useState(false);

  useEffect(() => imageChanged(imgSrc), [imgSrc]);

  const onSelectFile = (e) => {
    if(e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const [cropper, setCropper] = useState();

  return <div className="ImagePickerComponent w-100">
    {!imgSrc &&
      <div className="place-image d-flex flex-column align-items-start">
        <div
          className="d-flex flex-column align-items-center image-holder border rounded bg-white"
          style={{
            width: config.width,
            height: config.height,
          }}
        >
          <div className="bg-white">
            <Button
              className="py-0 px-1 poiter" size="sm" variant="outline-success"
              onClick={(event) => {
                event.preventDefault();
                imageInput?.current?.click();
              }}
            >Add image
            </Button>
          </div>

          <input className="d-none" ref={imageInput} type="file" accept="image/*" onChange={onSelectFile} />
        </div>
      </div >
    }

    {imgSrc &&
      <div className="place-image">
        <div
          className="image-holder loaded"
          style={{
            height: config.height,
            width: config.width,
          }}
        >
          {
            cropping ? (
              <Cropper
                style={{ height: config.height, width: config.width }}
                zoomTo={0}
                initialAspectRatio={config.aspectRatio}
                aspectRatio={config.aspectRatio}
                src={imgSrc}
                viewMode={0}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                autoCropArea={1}
                rotatable={false}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />

            ) : (
              <img ref={imgRef} src={imgSrc} />
            )
          }
        </div>

        <div className="mt-2 text-center">
          <small className="text-secondary">{help_text}</small>
        </div>

        <div className="mt-2 d-flex px-2 justify-content-center">
          {
            cropping ? (
              <>
                <div onClick={() => {
                  const croppedImg = cropper.getCroppedCanvas();
                  setImgSrc(canvasPreview(croppedImg, {
                    x: 0,
                    y: 0,
                    width: config.cropWidth,
                    height: config.cropHeight,
                  }));
                  setCropping(false);
                }}>
                  <Button className="py-0 px-1 poiter" size="sm" variant="outline-success">Accept</Button>
                </div>
              </>
            ) : (
              <>
                <div className="me-1">
                  <a className="text-decoration-none" href={imgSrc} download="image">
                    <Button className="py-0 px-1 poiter" size="sm" variant="outline-dark">Download</Button>
                  </a>
                </div>

                <div className="ms-1" onClick={() => setImgSrc("")}>
                  <Button className="py-0 px-1 poiter" size="sm" variant="outline-danger">Delete</Button>
                </div>
              </>
            )
          }
        </div>
      </div>
    }

  </div >
})

export default ImagePickerComponent
