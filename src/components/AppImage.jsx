import { useState } from 'react';
import { cn } from "../utils/cn";
import Icon from './AppIcon';

function Image({
  src,
  alt = "",
  className = "",
  fallbackSrc = "/assets/images/no_image.png",
  showFallbackOnError = true,
  ...props
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = (e) => {
    setError(true);
    if (props.onError) props.onError(e);
  };

  const handleLoad = (e) => {
    setLoaded(true);
    if (props.onLoad) props.onLoad(e);
  };

  if (error && showFallbackOnError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        {...props}
      >
        <Icon name="Image" size={24} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        className,
        !loaded && "opacity-0",
        loaded && "opacity-100 transition-opacity duration-300"
      )}
      onError={handleError}
      onLoad={handleLoad}
      loading={props.loading || "lazy"}
      {...props}
    />
  );
}

export default Image;