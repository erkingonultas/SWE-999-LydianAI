import { useState, useCallback } from 'react';

export function useCodeVersions(initialCode) {
  const [versions, setVersions] = useState([initialCode]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

  const addVersion = useCallback((newCode) => {
    if(newCode.length > 0) { 
      setVersions((prev) => [...prev, newCode]);
      setCurrentVersionIndex((prev) => prev + 1);
    }
  }, []);

  const goToPreviousVersion = useCallback(() => {
    setCurrentVersionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNextVersion = useCallback(() => {
    setCurrentVersionIndex((prev) => Math.min(versions.length - 1, prev + 1));
  }, [versions.length]);

  return {
    currentCode: versions[currentVersionIndex],
    addVersion,
    goToPreviousVersion,
    goToNextVersion,
    canGoBack: currentVersionIndex > 0,
    canGoForward: currentVersionIndex < versions.length - 1,
  };
}
