import { Upload as UploadIcon, Image as ImageIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone(props) {
  const onImageDropped = props.onImageDropped;
  const t = props.t || ((key) => key);
  const currentLanguage = props.currentLanguage || 'en';
  const onDrop = useCallback(
    (acceptedFiles) => {
      onImageDropped(acceptedFiles[0]);
    },
    [onImageDropped]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div 
      className={`modern-button cursor-pointer select-none transition-all duration-200 ${
        isDragActive ? 'bg-blue-100 border-blue-300 scale-105' : ''
      }`} 
      {...getRootProps()}
    >
      <div className="flex items-center justify-center">
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex items-center gap-2">
            <ImageIcon className="icon text-blue-500" />
            <span className="text-blue-600 font-medium">{t('dropToUpload')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UploadIcon className="icon" />
            <span>{t('uploadImage')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
