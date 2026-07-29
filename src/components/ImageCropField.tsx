import { useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { ImagePlus, RotateCcw, X } from "lucide-react";
import { cropToWebp } from "../lib/cropImage";

export function ImageCropField({
  initialUrl,
  onChange,
}: {
  initialUrl?: string;
  onChange: (blob: Blob | null) => void;
}) {
  const [source, setSource] = useState("");
  const [preview, setPreview] = useState(initialUrl ?? "");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setPreview(initialUrl ?? "");
  }, [initialUrl]);

  useEffect(
    () => () => {
      if (source.startsWith("blob:")) URL.revokeObjectURL(source);
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview, source],
  );

  const chooseFile = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      window.alert("Use uma imagem JPEG, PNG ou WebP.");
      return;
    }
    const nextSource = URL.createObjectURL(file);
    setSource(nextSource);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const applyCrop = async () => {
    if (!source || !pixels) return;
    setProcessing(true);
    try {
      const blob = await cropToWebp(source, pixels);
      const nextPreview = URL.createObjectURL(blob);
      setPreview(nextPreview);
      setSource("");
      onChange(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="image-field">
      <div className="image-field-preview">
        {source ? (
          <Cropper
            image={source}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_area, nextPixels) => setPixels(nextPixels)}
          />
        ) : preview ? (
          <img src={preview} alt="Prévia da imagem selecionada" />
        ) : (
          <div className="image-field-empty">
            <ImagePlus aria-hidden="true" />
            <span>Imagem vertical 4:5</span>
          </div>
        )}
      </div>

      {source && (
        <label className="image-field-zoom">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>
      )}

      <div className="image-field-actions">
        <label className="admin-button admin-button-secondary">
          <ImagePlus aria-hidden="true" />
          Selecionar
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
        </label>
        {source && (
          <>
            <button className="admin-button" type="button" disabled={processing} onClick={applyCrop}>
              {processing ? "Processando..." : "Aplicar recorte"}
            </button>
            <button
              className="admin-icon-button"
              type="button"
              title="Cancelar recorte"
              onClick={() => setSource("")}
            >
              <X />
            </button>
          </>
        )}
        {!source && preview && (
          <button
            className="admin-icon-button"
            type="button"
            title="Trocar imagem"
            onClick={() => {
              setPreview("");
              onChange(null);
            }}
          >
            <RotateCcw />
          </button>
        )}
      </div>
    </div>
  );
}
