import React, { FunctionComponent } from "react";

export const Save: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="save"
    className={className}
    role="img"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
    />
  </svg>
);

export const Spinner: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="spinner"
    className={className}
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
    />
  </svg>
);

export const Info: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
  </svg>
);

export const ImageIcon: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="image"
    className={className}
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"
    />
  </svg>
);

export const User: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="user"
    className={className}
    role="img"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
    />
  </svg>
);

export const Clock: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="far"
    data-icon="clock"
    className={className}
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"
    />
  </svg>
);

export const Oven: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="far"
    data-icon="clock"
    className={className}
    role="img"
    viewBox="0 0 512 512"
  >
    <path d="m456.832031 0h-401.664062c-30.421875 0-55.167969 24.746094-55.167969 55.164062v73.367188h512v-73.367188c0-30.417968-24.746094-55.164062-55.167969-55.164062zm-334.828125 74.867188c-2.789062 2.800781-6.660156 4.398437-10.609375 4.398437-3.941406 0-7.808593-1.601563-10.597656-4.398437-2.792969-2.789063-4.402344-6.660157-4.402344-10.601563 0-3.949219 1.609375-7.820313 4.402344-10.609375 2.789063-2.789062 6.648437-4.390625 10.597656-4.390625s7.820313 1.601563 10.609375 4.390625c2.792969 2.789062 4.402344 6.660156 4.402344 10.609375 0 3.941406-1.609375 7.8125-4.402344 10.601563zm96.402344 0c-2.789062 2.800781-6.660156 4.398437-10.609375 4.398437-3.941406 0-7.8125-1.601563-10.601563-4.398437-2.789062-2.789063-4.390624-6.648438-4.390624-10.601563 0-3.949219 1.601562-7.820313 4.390624-10.609375 2.789063-2.789062 6.660157-4.390625 10.601563-4.390625 3.949219 0 7.820313 1.601563 10.609375 4.390625s4.390625 6.660156 4.390625 10.609375c0 3.941406-1.601563 7.8125-4.390625 10.601563zm96.398438 0c-2.789063 2.800781-6.660157 4.398437-10.609376 4.398437-3.9375 0-7.808593-1.601563-10.597656-4.398437-2.800781-2.789063-4.402344-6.660157-4.402344-10.601563 0-3.949219 1.601563-7.820313 4.402344-10.609375 2.789063-2.789062 6.648438-4.390625 10.597656-4.390625 3.949219 0 7.820313 1.601563 10.609376 4.390625 2.792968 2.789062 4.402343 6.660156 4.402343 10.609375 0 3.941406-1.609375 7.8125-4.402343 10.601563zm96.402343 0c-2.792969 2.800781-6.660156 4.398437-10.609375 4.398437-3.941406 0-7.8125-1.601563-10.601562-4.398437-2.789063-2.789063-4.398438-6.648438-4.398438-10.601563 0-3.949219 1.609375-7.820313 4.398438-10.609375 2.789062-2.789062 6.648437-4.390625 10.601562-4.390625 3.949219 0 7.816406 1.601563 10.609375 4.390625 2.789063 2.789062 4.390625 6.660156 4.390625 10.609375 0 3.941406-1.601562 7.8125-4.390625 10.601563zm0 0" />
    <path d="m417.734375 237.800781h-323.46875v194.933594h323.46875zm-49.265625 64.265625h-224.9375c-8.28125 0-15-6.714844-15-15s6.71875-15 15-15h224.9375c8.28125 0 15 6.714844 15 15s-6.71875 15-15 15zm0 0" />
    <path d="m0 456.832031c0 30.421875 24.746094 55.167969 55.167969 55.167969h401.664062c30.421875 0 55.167969-24.746094 55.167969-55.167969v-298.300781h-512zm64.265625-234.03125c0-8.285156 6.71875-15 15-15h353.46875c8.285156 0 15 6.714844 15 15v224.933594c0 8.285156-6.714844 15-15 15h-353.46875c-8.28125 0-15-6.714844-15-15zm0 0" />
  </svg>
);

export const Pause: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="far"
    data-icon="pause-circle"
    className={className}
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm96-280v160c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16zm-112 0v160c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16z"
    />
  </svg>
);

export const Bolt: FunctionComponent<{ className?: string }> = ({ className = "fill-current w-4 h-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="bolt"
    className={className}
    role="img"
    viewBox="0 0 320 512"
  >
    <path
      fill="currentColor"
      d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"
    />
  </svg>
);

export const Plus: FunctionComponent<{
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ className = "fill-current w-4 h-4 mr-2", onClick = () => void 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="plus"
    className={className}
    role="img"
    viewBox="0 0 448 512"
    onClick={onClick}
  >
    <path
      fill="currentColor"
      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
    />
  </svg>
);

export const Times: FunctionComponent<{
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ className = "fill-current w-4 h-4 mr-2", onClick = () => void 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="times"
    className={className}
    role="img"
    viewBox="0 0 352 512"
    onClick={onClick}
  >
    <path
      fill="currentColor"
      d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
    />
  </svg>
);

//https://aydos.com/svgedit/
//https://codesandbox.io/s/kind-archimedes-d9g6p
export const Lock: FunctionComponent<{
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ className = "fill-current w-4 h-4 mr-2", onClick = () => void 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="lock"
    className={className}
    onClick={onClick}
    role="img"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
    />
  </svg>
);

export const LockOpen: FunctionComponent<{
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ className = "fill-current w-4 h-4 mr-2", onClick = () => void 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="lock-open"
    className={className}
    onClick={onClick}
    role="img"
    viewBox="0 0 576 512"
  >
    <path
      fill="currentColor"
      d="M423.5 0C339.5.3 272 69.5 272 153.5V224H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48h-48v-71.1c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v80c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-80C576 68 507.5-.3 423.5 0z"
    />
  </svg>
);

export const Search: FunctionComponent<{
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ className = "fill-current w-4 h-4 mr-2", onClick = () => void 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="search"
    className={className}
    onClick={onClick}
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
    />
  </svg>
);

export const Sync: FunctionComponent<{
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ className = "fill-current w-4 h-4 mr-2", onClick = () => void 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="sync"
    className={className}
    onClick={onClick}
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"
    />
  </svg>
);
