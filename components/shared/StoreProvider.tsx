'use client';

import { AppStore, makeStore } from '@/lib/store';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

// Make sure Persistor type is imported or defined if needed, usually inferred
// import { Persistor } from 'redux-persist';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState<boolean>(false);
  const storeRef = useRef<AppStore | null>(null);
  // Add a ref for the persistor
  const persistorRef = useRef<ReturnType<typeof persistStore> | null>(null);

  if (!storeRef.current) {
    // Create the store instance
    storeRef.current = makeStore();
    // Create the persistor instance right after the store
    persistorRef.current = persistStore(storeRef.current);
  }
 

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Provider store={storeRef.current}>
      {/* Wrap children with PersistGate */}
      <PersistGate loading={null} persistor={persistorRef.current!}>
         {/* loading={null} means render nothing until rehydration is complete */}
         {/* You can put a loading spinner component here instead of null */}
        {children}
      </PersistGate>
    </Provider>
  );
}