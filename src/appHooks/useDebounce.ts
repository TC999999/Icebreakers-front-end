import { useState, useEffect } from "react";

// debounce function for search input, when a new search term from search engine hook is
// inputted by the user, waits 5 seconds before setting the term in state; for use in
// tanStack query for retrieving a list of search terms
const useDebounce = (searchTerm: string) => {
  const [newSearchInput, setNewSearchInput] = useState<string>("");

  // whenever search term input changes, sets .5 second timer that sets the new search term input:
  // allows for an efficient search engine that doesn't fetch new suggestions when user types new
  // input
  useEffect(() => {
    const timerID = setTimeout(() => {
      setNewSearchInput(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [searchTerm]);

  return { newSearchInput };
};

export default useDebounce;
