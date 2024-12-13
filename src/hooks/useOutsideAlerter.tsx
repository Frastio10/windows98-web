import { useRef, useEffect } from "react";

const useOutsideAlerter = (refs: React.RefObject<HTMLElement>[], onClickOutside: (ev: MouseEvent) => void): void => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const isOutside = refs.every(ref => ref.current && !ref.current.contains(event.target as Node));
      if (isOutside) {
        onClickOutside(event);
        return
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs]);
};

export default useOutsideAlerter;
