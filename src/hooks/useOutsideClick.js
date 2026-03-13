import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  //click outside function strong JS!
  useEffect(
    function () {
      function handleClick(e) {
        //ref.current maga a modal window dom element
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing],
  );

  return ref;
}
