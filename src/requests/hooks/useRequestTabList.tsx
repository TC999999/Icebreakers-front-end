import { useCallback } from "react";

// custom hook for request tab list; primarily used for keyboard accessibility functions
const useRequestTabList = () => {
  // when request tablist loses keyboard focus, removes focus class name from currently focused
  // tab
  const handleBlur = useCallback((e: React.FocusEvent) => {
    const currSelected = e.target.querySelector(
      'div.focused[role="tab"]',
    ) as HTMLDivElement;
    if (currSelected) currSelected.classList.remove("focused");
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const currFocused = e.currentTarget.querySelector(
        'div.focused[role="tab"]',
      );
      if (currFocused) currFocused.classList.remove("focused");
    },
    [],
  );

  // when user presses left or right arrow keys when focused on request tabs,
  // changes viewed request type to the next or previous request type respectively,
  // updates url search parameters, and clears previous request cache; if user is on
  // the very top or very bottom tab and presses the right or left arrow key respectively,
  // viewed request type changes to the very bottom or very top request type respectively
  // (i.e. it loops around)
  const handleKeydown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") e.preventDefault();

    const currSelected = (e.currentTarget.querySelector(
      'div.focused[role="tab"]',
    ) ||
      e.currentTarget.querySelector(
        'div.selected-tab[role="tab"]',
      )) as HTMLDivElement;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const next =
        e.key === "ArrowDown"
          ? currSelected.nextElementSibling
          : currSelected.previousElementSibling;

      currSelected.classList.remove("focused");
      if (next) {
        next.classList.add("focused");
      } else {
        const topOrBottom = (
          e.key === "ArrowDown"
            ? e.currentTarget.firstElementChild
            : e.currentTarget.lastElementChild
        ) as HTMLDivElement;

        topOrBottom.classList.add("focused");
      }
    } else if (
      e.key === "Enter" &&
      !currSelected.classList.contains("selected-tab")
    ) {
      currSelected.click();
    }
  }, []);

  return { handleBlur, handleKeydown, handleMouseEnter };
};

export default useRequestTabList;
